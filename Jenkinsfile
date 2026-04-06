pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = 'docker.io/jeewan'
        SONARQUBE_URL   = 'http://localhost:9005'
        SONAR_TOKEN     = 'sqp_60245e2a250fd9a117bedff252dfb1386800d44a'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        // ── Fix: ensure Jenkins can write inside the workspace ────────────────
        stage('Fix Workspace Permissions') {
            steps {
                sh 'chmod -R u+w . || true'
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
                        curl -sSLo sonar-scanner-cli.zip https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-5.0.1.3006-linux.zip
                        unzip -q -o sonar-scanner-cli.zip
                        export PATH=$PATH:$(pwd)/sonar-scanner-5.0.1.3006-linux/bin

                        for svc in auth sos chatbot gamification maps risk admin; do
                            cd backend/${svc}
                            sonar-scanner \
                                -Dsonar.projectKey=jeewan-${svc}-ms \
                                -Dsonar.sources=. \
                                -Dsonar.python.version=3 \
                                -Dsonar.host.url=http://localhost:9005 \
                                -Dsonar.login=sqp_60245e2a250fd9a117bedff252dfb1386800d44a
                            cd ../..
                        done
                    '''
                }
            }
        }

        // ── Fix 1: No .env copy needed — TestClient runs in-process ──────────
        // ── Fix 2: No withCredentials block needed here anymore ───────────────
        // ── Fix 3: mkdir -p ensures reports/ dir exists before pytest runs ────
        stage('Unit Tests — Backend') {
            steps {
                sh '''
                    cd backend
                    mkdir -p reports
                    pip install --break-system-packages -r requirements-test.txt
                    python3 -m pytest tests/test_auth.py tests/test_sos.py tests/test_chatbot.py tests/test_services.py \
                        -v --tb=short \
                        --junitxml=reports/unit-tests.xml \
                        --cov=. --cov-report=xml:reports/coverage.xml
                '''
            }
            post {
                always {
                    // Fix 4: allowEmptyResults prevents this block itself failing
                    // if pytest crashes before writing the XML
                    junit allowEmptyResults: true, testResults: 'backend/reports/unit-tests.xml'
                }
            }
        }

        stage('Component Tests — Frontend') {
            steps {
                sh '''
                    wget -q https://nodejs.org/dist/v20.11.1/node-v20.11.1-linux-x64.tar.xz
                    tar -xf node-v20.11.1-linux-x64.tar.xz
                    export PATH=$PATH:$(pwd)/node-v20.11.1-linux-x64/bin

                    npm install -g yarn
                    cd frontend
                    yarn install --frozen-lockfile
                    yarn build
                '''
            }
        }

        stage('Selenium E2E Tests') {
            steps {
                withCredentials([file(credentialsId: 'jeewan-dotenv', variable: 'ENV_FILE')]) {
                    sh '''
                        cd backend
                        # Fix 5: copy to a temp file first, then move — avoids
                        # "Permission denied" when Jenkins can't overwrite .env directly
                        cp "$ENV_FILE" .env.tmp && mv .env.tmp .env

                        docker-compose up -d

                        # Fix 6: poll until backend is actually ready instead of blind sleep
                        echo "Waiting for services to be healthy..."
                        timeout 60 bash -c "until curl -sf http://localhost:8001/health; do sleep 2; done" \
                            || echo "Auth service did not respond in time, continuing anyway"

                        export PATH=$PATH:$(pwd)/../node-v20.11.1-linux-x64/bin
                        cd ../frontend && yarn dev &
                        sleep 8

                        cd ../backend
                        mkdir -p reports
                        # Fix 7: removed || echo bypass — real failures now surface
                        python3 -m pytest tests/e2e/ -v --junitxml=reports/selenium.xml
                    '''
                }
            }
            post {
                always {
                    junit allowEmptyResults: true, testResults: 'backend/reports/selenium.xml'
                    sh 'cd backend && docker-compose down || true'
                }
            }
        }

        stage('Push Docker Images') {
            when { branch 'main' }
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
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
            when { branch 'main' }
            steps {
                withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBE_FILE')]) {
                    sh '''
                        export KUBECONFIG="$KUBE_FILE"
                        kubectl apply -f k8s/namespace.yaml
                        kubectl apply -f k8s/ --recursive
                        kubectl rollout status deployment/auth-ms -n jeewan --timeout=120s
                        kubectl rollout status deployment/sos-ms -n jeewan --timeout=120s
                    '''
                }
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