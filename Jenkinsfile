pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = 'docker.io/jeewan'
        SONARQUBE_URL   = 'http://172.17.0.1:9005'
        SONAR_TOKEN     = 'sqp_410d8249fe38cee4e65f32cf72eb91220cf0d862'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    def services = ['auth', 'sos', 'chatbot', 'gamification', 'maps', 'risk', 'admin']
                    for (svc in services) {
                        sh "docker build -t ${DOCKER_REGISTRY}/${svc}-ms:${BUILD_NUMBER} -t ${DOCKER_REGISTRY}/${svc}-ms:latest backend/${svc}/"
                    }
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    sh '''
                        # Dynamically pull the authentic SonarScanner binary into the Jenkins worker workspace
                        curl -sSLo sonar-scanner-cli.zip https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-5.0.1.3006-linux.zip
                        unzip -q -o sonar-scanner-cli.zip
                        export PATH=$PATH:$(pwd)/sonar-scanner-5.0.1.3006-linux/bin
                        
                        for svc in auth sos chatbot gamification maps risk admin; do
                            cd backend/${svc} && \
                            sonar-scanner \
                                -Dsonar.projectKey=jeewan-${svc}-ms \
                                -Dsonar.sources=app/ \
                                -Dsonar.host.url=${SONARQUBE_URL} \
                                -Dsonar.login=${SONAR_TOKEN} \
                                -Dsonar.python.version=3.12
                            cd ../..
                        done
                    '''
                }
            }
        }

        stage('Unit Tests — Backend') {
            steps {
                sh '''
                    cd backend
                    pip install --break-system-packages -r requirements-test.txt
                    python3 -m pytest tests/test_auth.py tests/test_sos.py tests/test_chatbot.py tests/test_services.py \
                        -v --tb=short --junitxml=reports/unit-tests.xml --cov=. --cov-report=xml:reports/coverage.xml
                '''
            }
            post {
                always {
                    junit 'backend/reports/unit-tests.xml'
                }
            }
        }

        stage('Component Tests — Frontend') {
            steps {
                sh '''
                    cd frontend
                    yarn install --frozen-lockfile
                    yarn build
                '''
            }
        }

        stage('Selenium E2E Tests') {
            steps {
                sh '''
                    cd backend
                    docker-compose up -d
                    sleep 15
                    cd ../frontend && yarn dev &
                    sleep 10
                    cd ../backend
                    python -m pytest tests/e2e/ -v --junitxml=reports/selenium.xml
                '''
            }
            post {
                always {
                    junit 'backend/reports/selenium.xml'
                    sh 'cd backend && docker-compose down'
                }
            }
        }

        stage('Push Docker Images') {
            when {
                branch 'main'
            }
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    script {
                        def services = ['auth', 'sos', 'chatbot', 'gamification', 'maps', 'risk', 'admin']
                        for (svc in services) {
                            sh "docker push ${DOCKER_REGISTRY}/${svc}-ms:${BUILD_NUMBER}"
                            sh "docker push ${DOCKER_REGISTRY}/${svc}-ms:latest"
                        }
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            when {
                branch 'main'
            }
            steps {
                sh '''
                    kubectl apply -f k8s/namespace.yaml
                    kubectl apply -f k8s/ --recursive
                    kubectl rollout status deployment/auth-ms -n jeewan --timeout=120s
                    kubectl rollout status deployment/sos-ms -n jeewan --timeout=120s
                '''
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'backend/reports/**', allowEmptyArchive: true
        }
        success {
            echo '✅ JEEWAN CI/CD Pipeline — All stages passed!'
        }
        failure {
            echo '❌ JEEWAN CI/CD Pipeline — Build failed. Check logs.'
        }
    }
}
