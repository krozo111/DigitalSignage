/**
 * 🧹 ONE-TIME CLEANUP SCRIPT
 * 
 * Paste this ENTIRE block into your browser console while logged into
 * the admin panel (you need Firebase Auth to have write access).
 * 
 * It will delete all screen documents that:
 *   1. Have no name, or are still named "New TV" / "Nueva TV"
 *   2. Have a lastSeen older than 24 hours
 * 
 * Run this ONCE. It logs every deletion.
 */

(async () => {
  // Import from the global Firebase SDK already loaded by your app
  const { getFirestore, collection, getDocs, deleteDoc, query, Timestamp } = await import('firebase/firestore');
  const { getApp } = await import('firebase/app');
  
  const db = getFirestore(getApp());
  const screensRef = collection(db, 'screens');
  const snapshot = await getDocs(query(screensRef));
  
  const now = Date.now();
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
  let deleted = 0;
  let kept = 0;
  
  console.log(`📊 Found ${snapshot.size} total screen documents. Analyzing...`);
  
  for (const doc of snapshot.docs) {
    const data = doc.data();
    const name = (data.name || '').trim();
    const lastSeen = data.lastSeen;
    
    // Check: unnamed/default name
    const isUnnamed = !name || name === 'New TV' || name === 'Nueva TV' || name === 'Desconectada';
    
    // Check: stale (lastSeen > 24h ago)
    let isStale = false;
    if (lastSeen) {
      const ms = lastSeen instanceof Timestamp 
        ? lastSeen.toMillis() 
        : (lastSeen.toDate ? lastSeen.toDate().getTime() : new Date(lastSeen).getTime());
      isStale = (now - ms) > TWENTY_FOUR_HOURS;
    } else {
      isStale = true; // no lastSeen at all = definitely stale
    }
    
    if (isUnnamed || isStale) {
      const reason = isUnnamed ? `unnamed ("${name || '<empty>'}")` : `stale (${Math.round((now - (lastSeen?.toMillis?.() || 0)) / 3600000)}h old)`;
      console.log(`  🗑️ DELETING: ${doc.id} — ${reason}`);
      await deleteDoc(doc.ref);
      deleted++;
    } else {
      console.log(`  ✅ KEEPING:  ${doc.id} — "${name}"`);
      kept++;
    }
  }
  
  console.log(`\n🏁 Done! Deleted: ${deleted} | Kept: ${kept}`);
})();
