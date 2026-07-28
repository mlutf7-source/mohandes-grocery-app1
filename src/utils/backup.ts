export async function autoBackup() {
  const data = localStorage.getItem('grocery-store');
  if (!data) return;

  const today = new Date().toISOString().split('T')[0];
  const lastBackup = localStorage.getItem('last-auto-backup');

  if (lastBackup === today) return;

  try {
    const backups = JSON.parse(localStorage.getItem('bakala-backups') || '[]');
    backups.unshift({
      name: `bakala-auto-${today}.json`,
      date: today,
      data: data,
      size: new Blob([data]).size,
    });
    if (backups.length > 30) backups.pop();
    localStorage.setItem('bakala-backups', JSON.stringify(backups));
    localStorage.setItem('last-auto-backup', today);
  } catch (err) {
    console.error('Auto backup failed:', err);
  }
}

export async function checkAndNotifyBackup() {
  const lastBackup = localStorage.getItem('last-auto-backup');
  const today = new Date().toISOString().split('T')[0];
  
  if (lastBackup !== today) {
    return 'لم يتم عمل نسخ احتياطي اليوم';
  }
  return null;
    }
