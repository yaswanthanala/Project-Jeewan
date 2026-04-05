'use client';

interface BadgeCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isEarned: boolean;
  earnedDate?: string;
}

export default function BadgeCard({ icon, title, description, isEarned, earnedDate }: BadgeCardProps) {
  return (
    <div className={`p-4 rounded-lg border-2 text-center transition-all ${
      isEarned
        ? 'bg-jeewan-nature/10 border-jeewan-nature shadow-md'
        : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 opacity-60'
    }`}>
      <div className={`text-4xl mb-2 inline-block p-3 rounded-lg ${
        isEarned ? 'bg-jeewan-nature/20' : 'bg-gray-300 dark:bg-gray-600'
      }`}>
        {icon}
      </div>
      <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{title}</h3>
      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{description}</p>
      {isEarned && earnedDate && (
        <p className="text-xs font-semibold text-jeewan-nature">Earned {earnedDate}</p>
      )}
      {!isEarned && (
        <p className="text-xs text-gray-500">Keep going to unlock!</p>
      )}
    </div>
  );
}
