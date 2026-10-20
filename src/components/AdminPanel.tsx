const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formQuestionText.trim() || !formAnswerText.trim()) {
      return alert('يرجى كتابة نص السؤال والجواب النموذجي أولاً');
    }

    try {
      const payload: any = {
        gradeId: formGradeId,
        subjectId: formSubjectId,
        chapter: formChapter.trim() || (subjectChapters[0] || 'الفصل الأول'),
        lessonName: formLessonName.trim(),
        questionText: formQuestionText.trim(),
        answerText: formAnswerText.trim(),
        options: formQuestionType === 'multiple_choice' ? formOptions.filter((o) => o.trim()) : [],
        correctAnswerIndex: formCorrectIndex,
        explanation: formExplanation.trim(),
        isVipOnly: formIsVipOnly,
        difficulty: 'medium',
        tags: [getIraqiGradeName(formGradeId), formQuestionType],
        questionType: formQuestionType,
        badgeType: formBadgeType,
      };

      // إضافة رابط الصورة فقط إذا تم إدخاله لمنع إرسال undefined إلى Firestore
      if (formImageUrl.trim()) {
        payload.imageUrl = formImageUrl.trim();
      }

      if (editingQuestion) {
        updateQuestion(editingQuestion.id, payload);
      } else {
        addQuestion(payload);
      }

      playCorrectSound();
      setIsQuestionModalOpen(false);
      setEditingQuestion(null);
      alert('تم حفظ وتثبيت السؤال بنجاح في بنك الأسئلة وقاعدة البيانات! ✓');
    } catch (err: any) {
      console.error('Error saving question:', err);
      alert('حدث خطأ أثناء حفظ السؤال: ' + (err?.message || 'يرجى التأكد من البيانات'));
    }
  };
