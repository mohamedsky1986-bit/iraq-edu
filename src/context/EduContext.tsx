// Realtime Heartbeat Presence Tracker (تحديث التواجد أونلاين كل دقيقة)
  useEffect(() => {
    if (!currentStudent || !currentStudent.id) return;

    const updatePresence = (onlineStatus: boolean) => {
      const nowIso = new Date().toISOString();
      setDoc(doc(db, 'students', currentStudent.id), {
        lastActiveAt: nowIso,
        isOnline: onlineStatus,
      }, { merge: true }).catch(() => {});
    };

    updatePresence(true);

    const interval = setInterval(() => {
      updatePresence(true);
    }, 45000);

    const handleUnload = () => {
      updatePresence(false);
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [currentStudent?.id]);
