import type { TranslationKey } from '@/lib/i18n/catalogue/en';

export const HE_CATALOGUE: Record<TranslationKey, string> = {
  'error.MODEL_FILE_MISSING':
    'קובץ מודל שדרוש לרינדור הזה אינו נמצא בדיסק, ולכן לא בוצע רינדור. יש להוריד אותו לתיקיית המודלים לפני שאפשר יהיה להריץ את זה.',
  'error.MODEL_HASH_MISMATCH':
    'קובץ מודל שנמצא בדיסק אינו תואם ל-hash שרשום במניפסט. הסיבה הרגילה היא הורדה שנקטעה: יש למחוק את הקובץ ולהוריד אותו מחדש.',
  'error.RUNTIME_START_FAILED':
    'ה-runtime המקומי של המודל הזה לא עלה, ולכן לא בוצע רינדור. זו תקלה בהתקנה ולא בקשה שגויה — ה-runtime נכשל עוד לפני שראה את המשימה.',
  'error.MPS_OUT_OF_MEMORY':
    'אזל הזיכרון של ה-GPU בשוט הזה. יש לבחור פרופיל רינדור נמוך יותר או משך קצר יותר — אותה בקשה תיכשל בדיוק באותו אופן.',
  'error.MPS_UNSUPPORTED_OP':
    'המודל הזה דורש פעולה שה-backend של Metal אינו מממש, ולכן הוא לא יכול לרוץ במסלול ה-GPU הזה. מודל אחר או הרצה על ה-CPU הם הדרך לעקוף את זה.',
  'error.CUDA_OUT_OF_MEMORY':
    'אזל הזיכרון של ה-GPU בשוט הזה. יש לבחור פרופיל רינדור נמוך יותר או משך קצר יותר — אותה בקשה תיכשל בדיוק באותו אופן.',
  'error.CUDA_DRIVER_ERROR':
    'הדרייבר של CUDA דיווח על תקלה. מקור התקלה הוא בדרייבר או בכרטיס ולא בבקשה, ולכן שום שינוי בשוט הזה לא יעקוף אותה.',
  'error.GPU_OFFLOAD_THRASHING':
    'המודל לא נכנס לזיכרון ה-GPU ולכן הוא נטען ומפונה שוב ושוב. זו לא קריסה — הרינדור יסתיים, אבל הרבה יותר לאט מהרגיל. פרופיל רינדור נמוך יותר מונע את זה.',
  'error.OUTPUT_DECODE_FAILED':
    'הרינדור הפיק קובץ שלא ניתן לפענח. הפלט אינו שמיש ויש לרנדר את השוט מחדש.',
  'error.OUTPUT_DURATION_INVALID':
    'הרינדור הפיק קליפ באורך שגוי. אי אפשר לשבץ אותו בטיימליין כפי שהוא.',
  'error.CHARACTER_IDENTITY_FAILURE':
    'הסובייקט שרונדר סטה מהרפרנס הקנוני שלו. יש להשוות את השוט לסט הרפרנסים של הסובייקט לפני שמאשרים משהו שנבנה עליו.',
  'error.AUDIO_SILENT':
    'האודיו שנוצר יצא שקט. שורת הדיאלוג לא הפיקה צליל, ולכן אין בשוט דיאלוג לערוך מולו.',
  'error.AUDIO_CLIPPING':
    'האודיו שנוצר עובר קליפינג. הפיקים מעוותים והעיוות יישאר גם אחרי המיקס.',
  'error.PROMPT_SCHEMA_INVALID':
    'המתכנן החזיר מבנה שהפייפליין הזה לא יכול להשתמש בו. יש להריץ מחדש את שלב התכנון לפני שאפשר לבנות ממנו רינדור כלשהו.',
  'error.OFFLINE_POLICY_VIOLATION':
    'ספק הופנה אל מחוץ למחשב הזה, והיצירה נעצרה. אסור שדבר יצא מהמחשב הזה — יש לאתר את הספק שהוגדר מחדש לפני שמריצים כל דבר נוסף.',
  'error.DISK_SPACE_LOW':
    'אין מספיק מקום פנוי כדי להתחיל את הרינדור הזה, ולכן הוא נדחה עוד לפני שהתחיל. יש לפנות מקום, או להעביר את שורש הפרויקט לדיסק גדול יותר, לפני שליחה נוספת.',
  'error.NO_ELIGIBLE_PROVIDER':
    'אף ספק במחשב הזה לא יכול להריץ את המשימה הזו, ולכן שום דבר לא נכנס לתור. צריך קודם להקים worker שמפרסם את היכולת הזו.',
  'error.CAPABILITY_NOT_BENCHMARKED':
    'יש ספק שיכול להריץ את זה, אבל הגבולות שלו על החומרה הזו עדיין לא נמדדו. כל עוד אין benchmark, משך או פרופיל שלא נבדקו הם ניחוש ולא יכולת.',
  'error.MEDIA_TOOL_UNAVAILABLE':
    'ה-FFmpeg שמותקן במחשב הזה לא יכול לבצע את מה שהשלב הזה דורש — או שהוא לא נמצא ב-path, או שהבנייה שנמצאה חסרה את ה-encoder, ה-filter או ה-muxer שנדרשים. זו תקלה בהתקנה: אותה בקשה תיכשל בדיוק באותו אופן עד שיוחלף FFmpeg.',

  'error.SOURCE_ASSET_IMMUTABLE':
    'לא ניתן לערוך קובץ מקור שיובא. המקורות נשמרים בדיוק כפי שהגיעו וכל שינוי יוצר גרסה נגזרת חדשה, ולכן יש לבצע זאת כנכס נגזר ולא כעריכה.',
  'error.IMPORT_PATH_REJECTED':
    'הנתיב נדחה משום שהוא מוביל אל מחוץ לאחסון של הפרויקט הזה, ושום דבר לא יובא. בחר קובץ בתוך תיקיית הפרויקט, או העתק אותו לשם תחילה.',
  'error.network':
    'ה-orchestrator לא עונה. זה התהליך שמריץ כל רינדור, ולכן שום דבר לא יכול להתחיל עד שהוא יחזור.',
  'error.malformed':
    'משהו אחר, לא ה-orchestrator, ענה לבקשה הזו: התשובה לא הייתה JSON. יש לוודא שהנתיב הזה מגיע ל-orchestrator ולא לשרת שמגיש את הדף.',
  'error.contract':
    'ה-orchestrator החזיר מבנה שהבילד הזה לא מזהה. שני הצדדים נמצאים על גרסאות חוזה שונות.',
  'error.status': 'ה-orchestrator דחה את הבקשה הזו עם סטטוס {status}.',
  'error.unrecognisedCode':
    'ה-orchestrator דיווח על שגיאה שאין לה עדיין הודעה בממשק הזה. הקוד הגולמי שמופיע למטה הוא בדיוק מה שהוא החזיר.',
  'error.routeGeneric':
    'משהו נכשל בעת הצגת הדף הזה. שאר החלקים של Local AI Studio לא נפגעו.',

  'language.label': 'שפת הממשק',
  'language.en': 'English',
  'language.he': 'עברית',

  'error.pageTitle': 'הדף הזה לא נטען',
  'error.fatalTitle': 'Local AI Studio נתקל בשגיאה שאי אפשר להתאושש ממנה',
  'error.fatalDescription':
    'יש לטעון מחדש את האפליקציה. אם זה חוזר על עצמו, כדאי לבדוק שה-orchestrator עדיין רץ.',
  'error.reload': 'טעינה מחדש',

  'offline.unknown.label': 'טרם אומת',
  'offline.unknown.description':
    'עדיין לא אומת שהפרויקט הזה רץ מקומית בלבד. אין להתייחס לזה כאל ערובה לכך שהמידע נשאר במחשב הזה.',
  'offline.remote.label': 'לא מקומי',
  'offline.remote.description':
    'הבילד הזה לא רץ מקומית בלבד. נתוני הפרויקט עלולים לצאת מהמחשב הזה — יש לבדוק את ההגדרות של ה-orchestrator.',
  'offline.operatorEnabled.label': 'אופרטור פעיל',
  'offline.operatorEnabled.description':
    'האופרטור של Claude Code מופעל. כל עוד הוא פעיל, ההקשר של הפרויקט יכול לצאת מהמחשב הזה דרך השירות של Claude.',
  'offline.lanWorkers.label': 'workers ברשת המקומית מורשים',
  'offline.lanWorkers.description':
    'workers ברשת המקומית רשאים לקחת משימות רינדור של הפרויקט הזה. נתוני הפרויקט יכולים לעבור למכונות האלה.',
  'offline.strictOffline.label': 'אופליין קפדני',
  'offline.strictOffline.description':
    'מצב אופליין קפדני מופעל בפרויקט הזה: כל עוד הוא מוגדר, אין להתייחס ל-Claude Code כאל אופרטור זמין.',
  'offline.local.label': 'מקומי בלבד',
  'offline.local.description':
    'הפרויקט הזה רץ מקומית בלבד. שום רינדור ושום הקשר לא יוצאים מהמחשב הזה.',

  'connection.unknown.label': 'טרם אומת',
  'connection.unknown.description':
    'עדיין לא נעשה ניסיון להתחבר ל-orchestrator. אין להתייחס לזה כאל חיבור תקין.',
  'connection.connecting.label': 'מתחבר',
  'connection.connecting.description': 'מתחבר ל-orchestrator.',
  'connection.open.label': 'מחובר',
  'connection.open.description':
    'מחובר ל-orchestrator. התקדמות הרינדור מתעדכנת בזמן אמת.',
  'connection.closed.label': 'מנותק',
  'connection.closed.description':
    'החיבור בזמן אמת ל-orchestrator נפל. במחשב הזה זה בדרך כלל אומר שתהליך ה-orchestrator נעצר, וכל רינדור שהיה באמצע נעצר יחד איתו.',
  'connection.reconnecting.label': 'מתחבר מחדש',
  'connection.reconnecting.description':
    'מתחבר מחדש ל-orchestrator. עד שהחיבור יחזור, ייתכן שהתקדמות הרינדור תפגר מאחור.',

  'shell.skipToMain': 'דילוג לתוכן הראשי',
  'route.project': 'פרויקט',
  'route.production': 'הפקה',
  'page.designSystem.title': 'מערכת העיצוב',
  'productionStage.screenplay': 'תסריט',
  'productionStage.musicPlan': 'תוכנית מוזיקלית',
  'shell.showNavigation': 'הצגת הניווט',
  'shell.hideNavigation': 'הסתרת הניווט',
  'shell.primaryNavigation': 'ראשי',
  'shell.breadcrumb': 'נתיב ניווט',
  'shell.productionStages': 'שלבי ההפקה',
  'shell.loadingPage': 'טעינת הדף',

  'stage.unknown': 'טרם אומת',
  'stage.pending': 'ממתין',
  'stage.in_review': 'בסקירה',
  'stage.approved': 'מאושר',
  'stage.blocked': 'חסום',

  'readiness.title': 'מוכנות',
  'readiness.unknown.label': 'טרם אומת',
  'readiness.unknown.description':
    'האורקסטרטור עדיין לא דיווח על תוצאות הבדיקות המקדימות. שום דבר כאן לא אומר שהמחשב הזה יכול או לא יכול לרנדר.',
  'readiness.ready.label': 'מוכן לרינדור',
  'readiness.ready.description':
    'כל הבדיקות המקדימות עברו ויש מקום בדיסק כדי להתחיל רינדור.',
  'readiness.blocked.label': '{failed} מתוך {total} בדיקות לא עברו',
  'readiness.blocked.description':
    'רינדור הפקה יסרב להתחיל עד שאלה ייפתרו. בדיקה שלא רצה אינה בדיקה שעברה.',
  'readiness.checkedAt': 'נבדק {time}',
  'readiness.rerun': 'הרץ בדיקות מחדש',
  'readiness.rerunning': 'מריץ מחדש',
  'readiness.error.title': 'לא ניתן לקרוא את הבדיקות המקדימות',
  'readiness.diskShortfall': 'רינדור יסרב להתחיל. חסרים בדיסק הזה:',

  'system.mode.title': 'מצב הפעלה',
  'system.mode.localOnly': 'יצירה מקומית בלבד',
  'system.mode.strictOffline': 'מצב לא-מקוון מוחלט',
  'system.mode.allowLanWorkers': 'עובדי רינדור ברשת המקומית',
  'system.mode.claudeCodeOperator': 'מפעיל Claude Code',
  'system.mode.lmStudioMcpHost': 'מארח MCP של LM Studio',
  'system.mode.lmStudioMcpHost.description':
    'מודל מקומי ב-LM Studio יכול להפעיל את הסטודיו דרך כלי ה-MCP שלו. זהו משטח שליטה על המחשב הזה, ולא דרך החוצה ממנו.',
  'system.mode.error.title': 'לא ניתן לקרוא את מצב ההפעלה',
  'system.value.on': 'פעיל',
  'system.value.off': 'כבוי',

  'system.hardware.title': 'פרופיל חומרה',
  'system.hardware.unknown.title': 'המחשב הזה אינו תואם לאף פרופיל חומרה מוכר',
  'system.hardware.unknown.description':
    'בלי פרופיל, רינדורים מסרבים להתחיל — כל גבול יכולת נמדד לכל פרופיל בנפרד. צריך להוסיף פרופיל למחשב הזה לפני שמשהו ירוץ.',
  'system.hardware.unpublished':
    'האורקסטרטור עדיין לא מפרסם את מנוע ההאצה ואת היכולות שנמדדו לפרופיל הזה.',

  'system.disk.title': 'דיסק',
  'system.disk.free': 'מקום פנוי',
  'system.disk.missingModels': 'קובצי מודל חסרים',
  'system.disk.workingSpace': 'שטח עבודה שמור',
  'system.disk.safetyHeadroom': 'מרווח ביטחון',
  'system.disk.required': 'נדרש כדי להתחיל',
  'system.disk.shortfall': 'חסר',
  'system.disk.passed': 'יש מספיק מקום פנוי כדי שרינדור יתחיל.',

  'system.models.title': 'מודלים',
  'system.models.summary': 'הקבצים של {ready} מתוך {total} מודלים נמצאים בדיסק',
  'system.models.missingTotal': 'להורדה או להחלפה:',
  'system.models.root': 'תיקיית המודלים',
  'system.models.license': 'רישיון',
  'system.models.size': 'גודל',
  'system.models.missing': 'להורדה או להחלפה',
  'system.models.upstream': 'מאגר מקור',
  'system.models.filesPresent': 'הקבצים מוכנים',
  'system.models.filesMissing': 'הקבצים אינם מוכנים',
  'system.models.readyMeaning':
    '"הקבצים מוכנים" אומר שכל קובץ יושב בדיסק בגודל שהמניפסט מצהיר עליו. זה לא אומר שהקובץ תקין: שום דבר כאן לא קורא hash, ובדיקת ה-preflight ‏MODEL_HASHES_MATCH היא זו שעושה זאת. זה גם לא אומר שהמודל עבר benchmark על החומרה הזו — האורקסטרטור עדיין לא מפרסם את הסיווג הזה, ולכן אין לקרוא שום דבר כאן כ"נבדק".',
  'system.models.noDownload':
    'Local AI Studio לעולם אינו מוריד מודל. יש להריץ את זה בעצמכם:',
  'system.models.files': 'קבצים',
  'system.models.empty': 'המניפסט אינו מצהיר על אף מודל.',
  'system.models.error.title': 'לא ניתן לקרוא את דוח התקנת המודלים',
  'system.models.fileStatus.VERIFIED': 'ה-hash אומת',
  'system.models.fileStatus.PRESENT_UNVERIFIABLE': 'קיים, ה-hash לא ידוע',
  'system.models.fileStatus.MISSING': 'חסר',
  'system.models.fileStatus.SIZE_MISMATCH': 'גודל שגוי',
  'system.models.fileStatus.HASH_MISMATCH': 'אי-התאמה ב-hash',
  'system.models.fileStatus.UNREADABLE': 'לא ניתן לקריאה',
  'system.models.role.VIDEO': 'וידאו',
  'system.models.role.IMAGE': 'תמונה',
  'system.models.role.IMAGE_EDIT': 'עריכת תמונה',
  'system.models.role.TEXT': 'טקסט',
  'system.models.role.TTS': 'דיבור',
  'system.models.role.MUSIC': 'מוזיקה',

  'system.preflight.title': 'בדיקות מקדימות',
  'system.preflight.status.PASS': 'עברה',
  'system.preflight.status.FAIL': 'נכשלה',
  'system.preflight.status.NOT_APPLICABLE': 'לא רלוונטי',
  'system.preflight.status.NOT_IMPLEMENTED': 'לא ממומש',
  'system.preflight.notRunNote': 'בדיקה שלא רצה אינה בדיקה שעברה.',

  'system.pressure.title': 'זיכרון ועומס',
  'system.pressure.unavailable':
    'האורקסטרטור עדיין לא מפרסם קריאה חיה של זיכרון, VRAM או swap, ולכן אין כאן מה להציג. זו מדידה חסרה, ולא מדידה שהתקבלה בה אפס.',
  'system.runtimes.title': 'סביבות ריצה',
  'system.runtimes.unavailable':
    'האורקסטרטור עדיין לא מפרסם גרסה של ComfyUI, LM Studio, FFmpeg או מסד הנתונים. הבדיקות המקדימות הן הדבר היחיד שמדווח על כך שהן עולות.',

  'dashboard.projectData.title': 'שום דבר בפרויקט הזה עדיין לא מחובר',
  'dashboard.projectData.description':
    'נושאים, מיקומים, הפקות ונכסים לשימוש חוזר שייכים לכאן. האורקסטרטור עדיין לא מגיש נתוני פרויקט, ולכן לוח המחוונים הזה יכול לדווח רק על מה שהמחשב עצמו מסוגל לעשות.',
  'dashboard.openSystem': 'פתח מצב מערכת',

  'page.notFound.title': 'הדף לא נמצא',
  'page.notFound.description': 'שום דבר ב-Local AI Studio לא תואם לכתובת הזו.',
  'page.projects.title': 'פרויקטים',
  'page.projects.description':
    'כל פרויקטי Local AI Studio שנמצאים במחשב הזה. אין עדיין חיבור ל-orchestrator.',
  'page.dashboard.title': 'לוח בקרה',
  'page.dashboard.description':
    'מה מחכה לכם בפרויקט הזה, והאם המחשב הזה מסוגל לבצע את השלב הבא.',
  'page.assets.title': 'חומרי גלם',
  'page.assets.description':
    'צילומי המקור, התמונות והאודיו שהוכנסו לפרויקט הזה. אין עדיין חיבור ל-orchestrator.',
  'page.subjects.title': 'סובייקטים',
  'page.subjects.description':
    'האנשים, הדמויות והאובייקטים החוזרים שהפרויקט הזה זיהה לסקירה. אין עדיין חיבור ל-orchestrator.',
  'page.subjectReview.title': 'סקירת סובייקט',
  'page.subjectReview.description':
    'השוואה בין תמונות הרפרנס המועמדות של סובייקט ואישור אלה שמגדירות אותו. אין עדיין חיבור ל-orchestrator.',
  'page.styles.title': 'סגנונות',
  'page.styles.description':
    'הסגנונות הוויזואליים הזמינים לפרויקט הזה. אין עדיין חיבור ל-orchestrator.',
  'page.voices.title': 'קולות',
  'page.voices.description':
    'הקולות הזמינים לקריינות ולדיאלוג בפרויקט הזה. אין עדיין חיבור ל-orchestrator.',
  'page.locations.title': 'לוקיישנים',
  'page.locations.description':
    'הלוקיישנים הזמינים לפרויקט הזה. אין עדיין חיבור ל-orchestrator.',
  'page.props.title': 'אביזרים',
  'page.props.description':
    'האביזרים הזמינים לפרויקט הזה. אין עדיין חיבור ל-orchestrator.',
  'page.productions.title': 'הפקות',
  'page.productions.description':
    'כל ההפקות בפרויקט הזה, מהתסריט ועד הקאט הסופי. אין עדיין חיבור ל-orchestrator.',
  'page.planner.title': 'תוכנית',
  'page.planner.description':
    'התסריט או תוכנית ההפקה שעליהם מבוססת ההפקה הזו. אין עדיין חיבור ל-orchestrator.',
  'page.storyboard.title': 'סטוריבורד',
  'page.storyboard.description':
    'סקירה של הקיפריימים של ההפקה הזו, סצנה אחר סצנה, לפני הרינדור. אין עדיין חיבור ל-orchestrator.',
  'page.renderQueue.title': 'תור הרינדור',
  'page.renderQueue.description':
    'כל משימות הרינדור של ההפקה הזו וההתקדמות של כל אחת מהן. אין עדיין חיבור ל-orchestrator.',
  'page.shots.title': 'שוטים',
  'page.shots.description':
    'כל השוטים בהפקה הזו ומצב הסקירה הנוכחי של כל אחד. אין עדיין חיבור ל-orchestrator.',
  'page.shotReview.title': 'סקירת שוט',
  'page.shotReview.description':
    'השוואה בין שוט מרונדר לרפרנס שלו והחלטה אם הוא מספיק טוב. אין עדיין חיבור ל-orchestrator.',
  'page.audio.title': 'אודיו',
  'page.audio.description':
    'המוזיקה, הדיאלוג והמיקס של ההפקה הזו. אין עדיין חיבור ל-orchestrator.',
  'page.timeline.title': 'טיימליין',
  'page.timeline.description':
    'הרצף הערוך של ההפקה הזו והייצוא הסופי. אין עדיין חיבור ל-orchestrator.',
  'page.system.title': 'מערכת',
  'page.system.description':
    'פרופיל חומרה, מודלים מותקנים, מקום בדיסק, בדיקות מקדימות ומצב ההפעלה של ההתקנה הזו.',
};
