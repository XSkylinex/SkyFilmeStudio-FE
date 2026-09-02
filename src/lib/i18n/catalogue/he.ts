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
  'error.SHOT_TRANSITION_INVALID':
    'השוט הזה אינו במצב שהמעבר הזה הניח, ולכן שום דבר לא השתנה. או שהצעד מעולם לא היה חוקי מהמקום שבו השוט נמצא, או שמשהו אחר הזיז אותו קודם. קראו מחדש את השוט לפני שתחליטו מה הלאה.',
  'error.SHOT_STRATEGY_INVALID':
    'שוט שמציין סובייקט ביקש אסטרטגיית ייצור ששמורה לשוטים שאין בהם סובייקט. התוכנית צריכה להשתנות: שוט שמרכזו סובייקט מרונדר מקיפריים מאושר או מאסטרטגיה אחרת שמודעת לסובייקט.',
  'error.SHOT_DURATION_UNMEASURED':
    'לשוט הזה יש דיאלוג שהדיבור שלו עדיין לא נוצר, ולכן לא ידוע כמה זמן הוא נמשך. שוט עם דיאלוג מתוזמן לפי האודיו שנוצר בפועל — צרו קודם את טיוטת הדיבור. שליחה חוזרת לא תשנה דבר.',
  'error.SUBJECT_DESCRIPTOR_UNAVAILABLE':
    'לסובייקט בשוט הזה אין תיאור מוקפא, וכזה קיים רק אחרי שהסט הקנוני שלו אושר. אשרו קודם את הסובייקט: פרומפט אינו יכול לתאר מישהו שהמערכת עוד לא הסכימה איך הוא נראה.',
  'error.PROMPT_SPEC_IMMUTABLE':
    'אחד השוטים של הסצנה הזו כבר נושא פרומפט מהודר, שהוא התיעוד של האופן שבו משהו רונדר ולעולם אינו נדרס. משכו או החליפו את השוט הזה במפורש במקום להחליף את כל הסצנה.',
  'error.LIMITED_ANIMATION_OVERUSED':
    'חלק גדול יותר מהסצנה הזו הוא אנימציה מוגבלת ממה שהתוכנית מתירה, וכך הפקה הופכת למצגת שקופיות בלי שאיש בחר בכך. אם זו בחירה מכוונת, העלו את התקרה בבקשה עצמה במפורש.',
  'error.VOICE_PROFILE_NOT_APPROVED':
    'השורה הזו הייתה נאמרת בקול שאינו הקול המאושר של הדובר שלה — או שהפרופיל עדיין טיוטה, או שהוא שייך לסובייקט אחר. לסובייקט חוזר יש קול מאושר אחד, אחרת ההפקה מקבלת קול שונה בכל שורה. אשרו את פרופיל הקול של אותו סובייקט, או הפנו את השורה אליו.',
  'error.VOICE_LANGUAGE_UNSUPPORTED':
    'פרופיל הקול של השורה הזו אינו מצהיר על השפה שבה השורה כתובה. הוסיפו את השפה לפרופיל שכבר קיים — קול שני לאותו סובייקט יגרום לו להישמע כמו שני אנשים שונים.',
  'error.DIALOGUE_AUDIO_IMMUTABLE':
    'שורת הדיאלוג הזו מאושרת, והאודיו שלה נוצר מהטקסט כפי שהוא. עריכת המילים או התזמון עכשיו תשאיר אודיו מאושר שאומר משהו אחר — בטלו קודם את האישור.',
  'error.ASR_UNAVAILABLE':
    'הבדיקה המייעצת שמאזינה חזרה לדיבור שנוצר לא יכלה לרוץ, כי אין מודל זיהוי דיבור מקומי זמין. האודיו עצמו לא נפגע — הוא פשוט לא תומלל ולא הושווה.',
  'error.TIER_REQUIRES_BENCHMARK':
    'רמת האנימציה לדיאלוג שהתבקשה חסומה מאחורי מדידת ביצועי חומרה ובדיקת עקביות סובייקט, ואף אחת מהן לא רצה במכונה הזו. שום דבר אינו ממתין לה — בחרו רמה אחרת.',
  'error.STORYBOARD_NOT_APPROVED':
    'השוט הזה זקוק לקיפריים מאושר לפני שמרנדרים ממנו וידאו, ואין לו לא כזה ולא ויתור מתועד. קיפריים שגוי כפול רינדור וידאו הוא שעת עבודה שנזרקת — אשרו קיפריים, או תעדו למה השוט הזה רשאי לוותר עליו.',
  'error.STORYBOARD_FRAME_IMMUTABLE':
    'הפריים הזה של הסטוריבורד אושר, ולכן הוא מוקפא. מה שרונדר ממנו שומר על הפריים שמולו רונדר — צרו את הבא במקום לערוך את זה.',
  'error.KEYFRAME_ANCHOR_REQUIRED':
    'קיפריים לשוט הזה חייב להיות מעוגן במראה המאושר של מה שנמצא בו — הדמות, הלוקיישן, האביזרים — ולא היה עוגן זמין. העיגון הזה הוא מה שמונע מאותה דמות להשתנות משוט לשוט.',
  'error.REGENERATION_MODE_REQUIRED':
    'יצירה מחדש של הפריים הזה מחייבת לציין את המצב: אותו פרומפט עם סיד חדש, שינוי מבוקר של הפרומפט, או קיפריים חדש. אלה פעולות שונות, וניסיון חוזר בלי שם הופך את היסטוריית הניסיונות לבלתי קריאה.',
  'error.QC_RUN_SCOPE_REQUIRED':
    'הרצת בקרת איכות חייבת להיות מוצמדת למשהו — או לשוט אחד או להפקה שלמה. ההרצה הזו לא ציינה אף אחד מהם, ולכן שום דבר לא יכול לומר מה היא בדקה. שליחה חוזרת ללא שינוי תיכשל באותו אופן.',
  'error.PRODUCTION_QC_REPORT_VERSION_EXISTS':
    'להפקה הזו כבר יש דוח בקרת איכות בגרסה הזו. הדוחות ממוספרים ולעולם לא נדרסים, ולכן הדוח הבא חייב להיות גרסה חדשה ולא שימוש חוזר בקיימת.',
  'error.KEYFRAME_REQUIREMENT_DERIVED':
    'הקביעה שקיפריים נדרש בגלל הסובייקטים שבשוט נעשית בזמן תכנון הסצנה, ולכן אי אפשר לבחור אותה ידנית — ציינו במקום זאת שאדם מבקש את הקיפריים. וברגע שהשוט נושא סובייקט קנוני, אי אפשר לשנות את הדרישה כלל: תעדו ויתור עם סיבה אם השוט הזה רשאי לוותר על השער.',
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
  'error.SUBJECT_NOT_APPROVED':
    'מערך ההפניות הקנוני של הסובייקט הזה טרם אושר, ולכן אי אפשר עדיין לייצר ממנו דבר. השער הזה הוא מה שמונע רינדור ארוך שרץ מול דמות שגויה.',
  'error.CANONICAL_SET_IMMUTABLE':
    'המערך הקנוני הזה אושר, ולכן לא ניתן עוד לשנות אותו. מערכים מאושרים מוקפאים במכוון — הפקה שכבר נצמדה למערך הזה לא אמורה להשתנות תחתיה. שינוי פירושו גרסה חדשה.',
  'error.CANONICAL_ANCHOR_REQUIRED':
    'למערך הזה אין הפניות, ולכן אישורו יקפיא גרסה שאינה מתארת דבר. יש להוסיף לפחות הפניה אחת, ואז לאשר.',
  'error.CANONICAL_DRAFT_EXISTS':
    'לסובייקט הזה כבר יש טיוטה קנונית פתוחה. קיימת טיוטה אחת בכל רגע, ולכן יש לאשר או לבטל את הפתוחה לפני שמתחילים אחרת.',
  'error.STYLE_PROFILE_IMMUTABLE':
    'גרסת פרופיל הסגנון הזו אושרה, ולכן לא ניתן עוד לשנות אותה. הפקה שכבר נצמדה לגרסה הזו חייבת למצוא אותה בדיוק כפי שהייתה, ולכן שינוי פירושו גרסה חדשה.',
  'error.STYLE_VERSION_CONFLICT':
    'גרסה אחרת של הסגנון הזה נוספה באותו רגע, ולכן הגרסה הזו הפסידה במרוץ על מספר הגרסה. שום דבר לא אבד ואין צורך להקליד מחדש — שלח שוב והיא תקבל את המספר הבא.',
  'error.VOICE_PROFILE_IMMUTABLE':
    'פרופיל הקול הזה אושר ודיאלוג כבר נצמד אליו, ולכן לא ניתן עוד לשנות אותו. שינוי פירושו פרופיל קול חדש, כך שהשורות שכבר הוקלטו יישמעו כפי שהיו.',
  'error.VOICE_ALREADY_APPROVED_FOR_SUBJECT':
    'לסובייקט הזה כבר יש קול מאושר, ולסובייקט יש קול אחד בלבד — זה מה שגורם לו להישמע כמו עצמו לאורך ההפקה. יש למחוק תחילה את הקול הקיים: ביטול האישור נדחה, ולכן מחיקה היא הדרך היחידה לפנות את המקום.',
  'error.PRONUNCIATION_DICTIONARY_EXISTS':
    'לפרויקט הזה כבר יש מילון הגייה לשפה הזו, ויש מילון אחד לכל שפה. יש להוסיף את הערך למילון הקיים במקום לפתוח מילון שני.',
  'error.PRONUNCIATION_ENTRY_EXISTS':
    'במילון כבר קיים ערך שמנורמל לאותו מונח כמו זה. שני איותים שונים יכולים להתנרמל לאותו דבר — ניקוד מפורק, סימן כיווניות שנשתרבב, רווח כפול — ולכן הערך שכבר קיים עשוי להיראות שונה ממה שהוקלד. אין מסלול לעריכת ערך, ולכן שינוי של אופן ההגייה פירושו מחיקת הערך הקיים והוספת ערך מחליף.',
  'error.LOCATION_IMMUTABLE':
    'המיקום הזה אושר, ולכן כבר לא ניתן לערוך אותו או לאשר אותו שוב. מיקומים מאושרים מוקפאים במכוון — שוטים שכבר תוכננו מולו לא אמורים לגלות שהמקום השתנה מתחתיהם. ההקפאה אינה חוסמת מחיקה, ושינוי פירושו מיקום חדש ולא עריכה.',
  'error.PROP_IMMUTABLE':
    'האבזר הזה אושר, ולכן כבר לא ניתן לערוך אותו או לאשר אותו שוב. כללי הרציפות שלו הם מה שסצנות מאוחרות נבדקות מולו, ולכן הם מוקפאים עם האישור. ההקפאה אינה חוסמת מחיקה, ושינוי פירושו אבזר חדש ולא עריכה.',
  'error.LOCATION_PLATE_IMMUTABLE':
    'ה-plate הזה אושר, ולכן כבר לא ניתן לערוך אותו או לאשר אותו שוב. plate מאושר הוא התמונה הקנונית לסוג שלו, וסצנות שכבר מוסגרו מולו לא אמורות לזוז. ההקפאה אינה חוסמת מחיקה, ושינוי פירושו plate חדש ולא עריכה.',
  'error.LOCATION_PLATE_KIND_ALREADY_APPROVED':
    'למיקום הזה כבר יש plate מאושר מהסוג הזה, ויש בדיוק אחד — זה מה ששומר על המקום מזוהה מקאט לקאט. יש למחוק קודם את זה שתופס את המקום: ביטול אישור נדחה, ולכן מחיקה היא הדרך היחידה לפנות אותו. טיוטות נוספות מאותו סוג יכולות לשבת לצידו בינתיים.',
  'error.PROJECT_BIBLE_IMMUTABLE':
    'גרסת הביבל הזו פורסמה, ולכן היא וכללי הדמויות שלה מוקפאים. הפקה שתכננה מולה שומרת על מה שתכננה מולו — שינוי פירושו פרסום הגרסה הבאה ולא עריכה של זו.',
  'error.PROJECT_BIBLE_VERSION_EXISTS':
    'גרסה אחרת של הביבל הזה נוצרה באותו רגע, ולכן זו הפסידה במרוץ על מספר הגרסה. שום דבר לא אבד ואין צורך להקליד מחדש — יש לשלוח שוב והיא תקבל את המספר הבא.',
  'error.PROJECT_BIBLE_NARRATIVE_NOT_APPLICABLE':
    'סוג הפרויקט הזה אינו נושא חלק נרטיבי, ולכן כללי עולם, שפה של הומור ודרמה, כרונולוגיה והתנהגות של דמויות חייבים להישאר ריקים. יש לרוקן את השדות האלה — בסוג פרויקט כזה הביבל הוא שאר החלקים בלבד.',
  'error.VOICE_RULES_REQUIRE_SPEECH':
    'הדמות הזו אינה רשומה כדמות מדברת, ולכן היא לא יכולה לשאת כללי קול. יש לרוקן את כללי הקול, או לרשום קודם את הדמות כמדברת.',
  'error.CONTINUITY_SCOPE_INVALID':
    'או שהטווח של עובדה אינו תקין — סצנת ההתחלה או הסיום אינה חלק מההפקה הזו, או שסצנת הסיום מגיעה לפני ההתחלה — או שלא ניתן לתכנן מחדש את ההפקה הזו כל עוד עובדות עדיין משויכות לסצנות שמוחלפות. יש לבחור את שתי הסצנות מתוך ההפקה הזו כשהסיום אינו מוקדם מההתחלה, או להסיר תחילה את העובדות שמפנות לסצנות האלה.',
  'error.SCENE_IN_USE':
    'לא ניתן לתכנן מחדש את ההפקה הזו: הסצנות שלה כבר נושאות שוטים, שורות דיאלוג או משימות רינדור, והחלת מתאר מחליפה את מערך הסצנות כולו. האורקסטרטור מסרב במקום לנתק את העבודה הזו — יש לעדכן את הסצנות אחת-אחת, או להסיר תחילה את מה שתלוי בהן.',
  'error.CONTINUITY_CONTEXT_REQUIRED':
    'האורקסטרטור ביקש ממודל להסיק על סצנה אחת בלי לספק את הסצנה עצמה, ולכן שום דבר לא נוצר. המודל אינו זוכר דבר בין תור לתור, ולכן ההקשר הזה אינו אופציונלי — זו תקלה באורקסטרטור ולא משהו לתקן כאן.',
  'error.PRODUCTION_TRANSITION_INVALID':
    'ההפקה הזו אינה יכולה לעבור למצב הזה מהמצב שבו היא נמצאת. או שתהליך העבודה אינו מתיר את המעבר — ההודעה מפרטת לאן אפשר להגיע מכאן — או שמעבר אחר הקדים אותה, ואז המצב שמוצג כבר אינו עדכני. יש לקרוא אותו מחדש לפני החלטה נוספת.',
  'error.PRODUCTION_PROFILE_SECTIONS_OVERLAP':
    'שני חלקים בפרופיל המבנה הזה מכסים את אותו קטע זמן. חלקים יכולים לחלוק גבול אך לא מקטע, ולכן יש לקצר אחד מהם או להזיז את נקודת ההתחלה שלו.',
  'error.PRODUCTION_PROFILE_IN_USE':
    'פרופיל המבנה הזה עדיין מוצמד להפקות שתוכננו מול תקציב הזמן שלו, ולכן הסרה שלו תשנה את מה שהן תוכננו מולו. יש להפנות את ההפקות האלה לפרופיל אחר קודם.',
  'error.PRODUCTION_RENDER_NOT_PERMITTED':
    'ההפקה הזו אינה במצב שמתיר את הרינדור שהוכנס לתור. רינדור ממתין לאישורים שהמצב הנוכחי עדיין לא עבר, וזה מה שמונע שעות עבודה מול תוכנית שאיש לא אישר.',
  'error.PLANNING_STAGE_MISSING':
    'שלב תכנון שההפקה הזו זקוקה לו לא הורץ. ההודעה מציינת איזה, ומפרטת את כל מה שסוג ההפקה הזה דורש — סוג שאינו זקוק לתסריט לא יבקש אחד.',
  'error.RUNTIME_BUDGET_OUT_OF_TOLERANCE':
    'ההפקה הזו אינה יכולה לצאת משלב התכנון מכיוון שהסצנות שלה אינן מגיעות לאורך היעד בתוך הסטייה שהוגדרה. ההודעה מציינת בכמה. יש להוסיף, לקצץ או לתזמן מחדש סצנות, או לשנות את היעד.',
  'error.RUNTIME_TOLERANCE_UNDECLARED':
    'לא ההפקה הזו ולא פרופיל המבנה שאליו היא קשורה מצהירים על סטיית אורך, ואין ברירת מחדל במכוון — סטייה שמתאימה לסרט של עשרים דקות אינה מתאימה לסרטון של שלושים שניות. יש להגדיר אחת על אחד מהם.',
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

  'approval.approve': 'אשר',
  'approval.reject': 'דחה',
  'approval.approveContext': 'אשר {context}',
  'approval.rejectContext': 'דחה {context}',
  'approval.regenerateContext': '{mode} עבור {context}',
  'mediaTile.failed': 'הטעינה נכשלה',
  'mediaTile.empty': 'אין תמונה עדיין',
  'toast.dismiss': 'סגור',

  'shortcuts.title': 'קיצורי מקלדת',
  'shortcuts.nextShot': 'מעבר לשוט הבא',
  'shortcuts.previousShot': 'מעבר לשוט הקודם',
  'shortcuts.approve': 'אישור הפריט בסקירה',
  'shortcuts.reject': 'דחיית הפריט בסקירה',
  'shortcuts.togglePlayback': 'הפעלה או השהיה של הסרטון הנוכחי',
  'shortcuts.toggleComparison': 'הצגה או הסתרה של תצוגת ההשוואה',
  'shortcuts.showHelp': 'הצגת רשימת קיצורי המקלדת',
  'shortcuts.key.space': 'רווח',
  'shortcuts.singleKey.label': 'קיצורי מקש בודד',
  'shortcuts.singleKey.description':
    'אישור, דחייה והפעלה מגיבים לאות בודדת ללא מקש עזר. כבה זאת אם מקש שהתכוונת להקליד מקבל החלטות.',

  'projects.loading': 'טוען פרויקטים',
  'projects.error.title': 'לא ניתן היה לקרוא את רשימת הפרויקטים',
  'projects.empty.title': 'אין עדיין פרויקטים',
  'projects.empty.description':
    'שום דבר לא נוצר במכשיר הזה. יצירת פרויקט אינה מחוברת בגרסה הזו — המתזמר מקבל אותה, אך מבנה הבקשה שהוא מאמת מולו אינו מפורסם בחוזה המשותף.',
  'projects.created': 'נוצר {date}',
  'projects.kind.SERIES': 'סדרה',
  'projects.kind.STANDALONE': 'עצמאי',
  'projects.kind.MUSIC': 'מוזיקה',
  'projects.kind.EXPERIMENTAL': 'ניסיוני',
  'projects.kind.CUSTOM': 'מותאם',
  'projects.language': 'שפה ראשית',
  'projects.open': 'פתח את {title}',

  'captureGuide.title': 'מדריך צילום',
  'captureGuide.intro':
    'עצות לצילום נושא, לא רשימה שיש להשלים. כל זווית למטה היא רשות, וזווית חסרה אינה שגיאה — למכונית אין דף הבעות.',
  'captureGuide.views': 'זוויות מומלצות',
  'captureGuide.advice': 'עצות צילום',
  'captureGuide.hide': 'הסתרת מדריך הצילום',
  'captureGuide.show': 'הצגת מדריך הצילום',
  'captureGuide.error.title': 'לא ניתן היה לקרוא את מדריך הצילום',

  'project.invalidId.title': 'זה אינו מזהה פרויקט',
  'project.invalidId.description':
    'הכתובת מכילה ערך שהמתזמר היה דוחה. פתח את הפרויקט מתוך רשימת הפרויקטים במקום לערוך את הכתובת.',
  'assets.title': 'נכסי מקור',
  'assets.loading': 'טוען נכסי מקור',
  'assets.error.title': 'לא ניתן היה לקרוא את רשימת הנכסים',
  'assets.empty.title': 'אין עדיין נכסי מקור',
  'assets.empty.description':
    'שום דבר לא יובא לפרויקט הזה. הייבוא אינו מחובר בגרסה הזו — המתזמר מקבל גם העלאה וגם ייבוא מנתיב מקומי, אך אף אחד ממבני הבקשה אינו מפורסם בחוזה המשותף.',
  'assets.thumbnailAlt': 'תמונה ממוזערת של {path}',
  'assets.immutable': 'מקור, לעולם לא נערך במקום',
  'assets.captured': 'צולם:',
  'assets.type.IMAGE': 'תמונה',
  'assets.type.VIDEO': 'וידאו',
  'assets.type.AUDIO': 'אודיו',
  'assets.type.DRAWING': 'רישום',
  'assets.type.RENDER_3D': 'רינדור תלת-ממד',
  'assets.type.DOCUMENT': 'מסמך',
  'assets.type.OTHER': 'אחר',
  'origin.CAMERA_CAPTURE': 'צילום במצלמה',
  'origin.IMPORTED': 'מיובא',
  'origin.LOCALLY_GENERATED': 'נוצר מקומית',
  'origin.DERIVED': 'נגזר',
  'assets.privacy.PROJECT_PRIVATE': 'פרטי לפרויקט',
  'assets.privacy.EXPORTABLE': 'ניתן לייצוא',
  'assetDetail.error.title': 'לא ניתן היה לקרוא את הנכס הזה',
  'assetDetail.loading': 'טוען את הנכס',
  'assetDetail.invalidAsset.title': 'זה אינו מזהה נכס',
  'assetDetail.invalidAsset.description':
    'הכתובת מכילה ערך שהמתזמר היה דוחה. פתח את הנכס מתוך הספרייה במקום לערוך את הכתובת.',
  'assetDetail.back': 'חזרה לספריית הנכסים',
  'assetDetail.identity.title': 'מה הקובץ הזה',
  'assetDetail.field.path': 'נתיב בפרויקט:',
  'assetDetail.field.mimeType': 'סוג מדיה:',
  'assetDetail.field.sha256': 'טביעת אצבע SHA-256:',
  'assetDetail.field.captured': 'צולם:',
  'assetDetail.field.added': 'נוסף לפרויקט:',
  'assetDetail.exportable':
    'הנכס הזה מסומן כניתן לייצוא, כלומר הוא עשוי לצאת מהמחשב הזה במסגרת תוצר. כל השאר נשאר בתוך הפרויקט.',
  'assetDetail.probe.title': 'מה שהמתזמר רשם',
  'assetDetail.probe.empty': 'המתזמר לא רשם נתונים עבור הנכס הזה.',
  'assetDetail.probe.unpublished':
    'הערכים נקראים בדיוק כפי שהמתזמר כתב אותם. החוזה המשותף מגדיר זאת כאובייקט חופשי, ולכן שום דבר כאן אינו מפורש ואינו מקבל יחידה.',
  'assetDetail.proxy.title': 'תצוגת עבודה',
  'assetDetail.proxy.absent.title': 'אין עדיין תצוגת עבודה',
  'assetDetail.proxy.absent.description':
    'למתזמר עדיין אין תצוגת עבודה לנכס הזה. תצוגה נוצרת על ידי משימה בתור, ולכן המשמעות היא שהמשימה טרם רצה. זו אינה שגיאה, והמקור נשאר ללא שינוי בכל מקרה.',
  'assetDetail.proxy.unsupported':
    'המתזמר מייצר תצוגת עבודה עבור וידאו בלבד. הנכס הזה אינו וידאו, ולכן אין מה לנגן.',
  'assetDetail.proxy.label': 'תצוגת עבודה של {path}',
  'assetDetail.proxy.retry': 'שאל שוב',
  'assetDetail.proxy.error.title': 'לא ניתן היה לברר אם קיימת תצוגת עבודה',
  'assetDetail.proxy.purpose':
    'זוהי תצוגת עבודה שנוצרה לצורך ניווט, ולא הקובץ המקורי. שפוט כאן קומפוזיציה ותזמון, לא איכות תמונה.',
  'assetDetail.derived.title': 'נכסים נגזרים',
  'assetDetail.derived.unavailable':
    'המתזמר אינו מפרסם דרך לשאול מה נגזר מנכס, ולכן לא ניתן להציג זאת עדיין. זו נקודת קצה חסרה, לא תוצאה ריקה.',
  'assetDetail.subjects.title': 'נושאים שמפנים לנכס הזה',
  'assetDetail.subjects.unavailable':
    'נושאים אינם מוגשים על ידי המתזמר עדיין, ולכן לא ניתן להציג כאן דבר. זו נקודת קצה חסרה, לא תוצאה ריקה.',

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
    '"הקבצים מוכנים" אומר שכל קובץ יושב בדיסק בגודל שהמניפסט מצהיר עליו, וזה כל מה שהדוח הזה בודק. זה לא אומר שהקובץ תקין: שום דבר במסך הזה לא פותח קובץ, וגם לא בדיקת ה-preflight ‏MODEL_HASHES_MATCH, שמדווחת את מה שאימות קודם רשם. קובץ קיים בגודל המוצהר מדווח כאן באותה צורה בין אם המניפסט מצהיר עבורו hash ובין אם לא, ולכן שום דבר במסך הזה לא מפריד בין מוכח ללא מוכח — ‏MODEL_HASHES_MATCH היא המקום שבו זה נראה, והיא נכשלת כל עוד קובץ קיים כלשהו לא עבר hash מאז שהשתנה. הרצת אימות היא בקשה נפרדת, ואין לה פקד במסך הזה. זה גם לא אומר שהמודל עבר benchmark על החומרה הזו — האורקסטרטור עדיין לא מפרסם את הסיווג הזה, ולכן אין לקרוא שום דבר כאן כ"נבדק".',
  'system.models.noDownload':
    'Local AI Studio לעולם אינו מוריד מודל. יש להריץ את זה בעצמכם:',
  'system.models.files': 'קבצים',
  'system.models.empty': 'המניפסט אינו מצהיר על אף מודל.',
  'system.models.error.title': 'לא ניתן לקרוא את דוח התקנת המודלים',
  'system.models.fileStatus.VERIFIED': 'ה-hash אומת',
  'system.models.fileStatus.PRESENT_UNVERIFIABLE': 'קיים, ה-hash לא ידוע',
  'system.models.fileStatus.PRESENT_UNVERIFIED': 'קיים, לא עבר hash מאז שהשתנה',
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
  'page.assetDetail.title': 'נכס',
  'subjects.title': 'סובייקטים',
  'subjects.loading': 'טוען סובייקטים',
  'subjects.error.title': 'לא ניתן היה לקרוא את רשימת הסובייקטים',
  'subjects.truncated':
    'קיימים יותר נושאים ממה שמוצג. המסך הזה קורא רק את העמוד הראשון, ועימוד עדיין לא נבנה.',
  'subjects.empty.title': 'אין עדיין סובייקטים',
  'subjects.empty.description':
    'שום דבר לא נרשם בפרויקט הזה. הרישום אינו מחובר בגרסה הזו — המתזמר מקבל סובייקט, אך מבנה הבקשה אינו מפורסם בחוזה המשותף.',
  'subjects.inactive': 'לא פעיל',
  'subjects.type.HUMAN': 'אדם',
  'subjects.type.ANIMAL': 'בעל חיים',
  'subjects.type.OBJECT': 'עצם',
  'subjects.type.FIGURE': 'דמות מעוצבת',
  'subjects.type.CREATURE': 'יצור',
  'subjects.type.VEHICLE': 'כלי רכב',
  'subjects.type.PRODUCT': 'מוצר',
  'subjects.type.ROBOT': 'רובוט',
  'subjects.type.ABSTRACT': 'מופשט',
  'subjects.type.OTHER': 'אחר',
  'subjects.sourceMode.CAPTURED': 'צולם',
  'subjects.sourceMode.IMPORTED': 'יובא',
  'subjects.sourceMode.GENERATED': 'נוצר',
  'subjects.sourceMode.HYBRID': 'משולב',
  'subjects.narrativeRole.CHARACTER': 'דמות',
  'subjects.narrativeRole.BACKGROUND_ENTITY': 'ישות רקע',
  'subjects.narrativeRole.PRODUCT': 'מוצר',
  'subjects.narrativeRole.OBJECT': 'עצם',
  'subjects.narrativeRole.OTHER': 'אחר',
  'subjects.approval.PENDING': 'ממתין לאישור',
  'subjects.approval.APPROVED': 'מאושר',
  'subjects.approval.REJECTED': 'נדחה',
  'subjects.role.SOURCE': 'מקור',
  'subjects.role.PRIMARY': 'ראשי',
  'subjects.role.FRONT_VIEW': 'חזית',
  'subjects.role.REAR_VIEW': 'גב',
  'subjects.role.LEFT_VIEW': 'שמאל',
  'subjects.role.RIGHT_VIEW': 'ימין',
  'subjects.role.THREE_QUARTER': 'שלושת רבעי',
  'subjects.role.DETAIL': 'פרט',
  'subjects.role.EXPRESSION': 'הבעה',
  'subjects.role.POSE': 'תנוחה',
  'subjects.role.TEXTURE': 'מרקם',
  'subjects.role.MASK': 'מסכה',
  'subjects.role.SCALE': 'הפניית קנה מידה',

  'subjectReview.error.title': 'לא ניתן היה לקרוא את הסובייקט הזה',
  'subjectReview.loading': 'טוען את הסובייקט',
  'subjectReview.invalidSubject.title': 'זה אינו מזהה סובייקט',
  'subjectReview.invalidSubject.description':
    'הכתובת מכילה ערך שהמתזמר היה דוחה. פתח את הסובייקט מתוך הרשימה במקום לערוך את הכתובת.',
  'subjectReview.back': 'חזרה לרשימת הסובייקטים',
  'subjectReview.identity.title': 'מה שאסור שישתנה',
  'subjectReview.identity.immutable': 'מאפיינים קבועים',
  'subjectReview.identity.prohibited': 'שינויים אסורים',
  'subjectReview.identity.mutable': 'עשוי להשתנות בין שוטים',
  'subjectReview.identity.wardrobe': 'כללי לבוש ומשטח',
  'subjectReview.identity.palette': 'לוח צבעים',
  'subjectReview.identity.scale': 'קנה מידה יחסי:',
  'subjectReview.identity.speech': 'סגנון דיבור:',
  'subjectReview.identity.none': 'לא נרשם דבר.',
  'subjectReview.canonical.error.title': 'לא ניתן היה לקרוא את המערך הקנוני',
  'subjectReview.references.error.title': 'לא ניתן היה לקרוא את ההפניות',
  'subjectReview.canonical.title': 'מערך הפניות קנוני',
  'subjectReview.canonical.absent.title': 'אין מערך מאושר',
  'subjectReview.canonical.absent.description':
    'לסובייקט הזה אין מערך קנוני מאושר, ולכן אי אפשר לייצר ממנו דבר. החסימה הזו היא כל העניין: היא מונעת רינדור ארוך שמתחייב לדמות שאיש לא הסכים לה.',
  'subjectReview.canonical.blocked':
    'היצירה עבור הסובייקט הזה חסומה עד לאישור מערך קנוני.',
  'subjectReview.canonical.version': 'גרסת אישור:',
  'subjectReview.canonical.approvedAt': 'אושר:',
  'subjectReview.canonical.frozenDescriptor': 'תיאור מוקפא',
  'subjectReview.canonical.frozenHash': 'SHA-256 של התיאור:',
  'subjectReview.canonical.frozenExplained':
    'האישור הקפיא את הנוסח הזה וגיבב אותו. תיקון מאוחר אינו יכול לשכתב את מה שהפקה קיימת תוכננה מולו — הוא הופך לגרסה חדשה.',
  'subjectReview.canonical.notes': 'הערות',
  'subjectReview.references.title': 'מה שהמערך מתאר',
  'subjectReview.references.empty':
    'למערך הזה אין עדיין הפניות. מערך בלי הפניה אינו יכול לעגן יצירה.',
  'subjectReview.references.anchor': 'כשיר לעיגון',
  'subjectReview.references.notAnchor': 'אינו עוגן',
  'subjectReview.references.anchorExplained':
    'עוגן הוא הפניה שיצירה יכולה להיקשר אליה. הפניה שאינה כשירה לעיגון עדיין חלק מהמערך, אך שום דבר אינו גוזר ממנה זהות.',
  'subjectReview.references.approved': 'מאושר',
  'subjectReview.references.pending': 'לא מאושר',
  'subjectReview.references.generated':
    'תוצר שנוצר — המתזמר עדיין אינו מגיש עבורו תמונה.',
  'subjectReview.references.alt': 'הפניית {role} עבור הסובייקט הזה',
  'subjectReview.comparison.title': 'המאושר מול הטיוטה',
  'subjectReview.comparison.explained':
    'הסט המאושר מצד אחד, הטיוטה הפתוחה מהצד השני, מותאמים לפי תפקיד ומוצגים בגדול. סחיפת זהות נשפטת כאן — הרשתות למעלה נועדו למצוא רפרנס, לא להשוות בין שניים.',
  'subjectReview.comparison.noApproved':
    'יש טיוטה אך עדיין אין סט מאושר, ולכן אין מול מה להשוות אותה. אישור הטיוטה הזאת הופך אותה לראש שכל טיוטה מאוחרת נשפטת ממנו.',
  'subjectReview.comparison.noDraft':
    'יש סט מאושר ואין טיוטה פתוחה, ולכן אין מה להשוות. השוואה מופיעה כשנפתחת טיוטה.',
  'subjectReview.comparison.approvedSide': 'מאושר',
  'subjectReview.comparison.draftSide': 'טיוטה',
  'subjectReview.comparison.missingSide': 'אין רפרנס {role} בצד {side}',
  'subjectReview.comparison.alt': 'רפרנס {role} — {side}',
  'subjectReview.draft.title': 'טיוטה פתוחה',
  'subjectReview.draft.error.title':
    'לא ניתן היה לקרוא את הטיוטות של הסובייקט הזה',
  'subjectReview.draft.none.title': 'אין טיוטה פתוחה',
  'subjectReview.draft.none.description':
    'אישור מתבצע על טיוטה, לעולם לא על המערך המאושר. לסובייקט הזה אין טיוטה פתוחה.',
  'subjectReview.draft.cannotOpen':
    'פתיחת טיוטה אינה מוצעת כאן: היא דורשת גוף בקשה שהמתזמר אינו מפרסם את צורתו בחבילת החוזה, והבנייה הזו לא תנחש אותה.',
  'subjectReview.draft.opened': 'נפתחה:',
  'subjectReview.draft.notes': 'הערות',
  'subjectReview.draft.context': 'המערך הקנוני של {subject}',
  'subjectReview.draft.explained':
    'אישור מקפיא את המערך הזה. התיאור שלו נרשם ומגובב, הוא הופך לגרסה שכל יצירה מעוגנת אליה, ולא ניתן לשנות בו דבר לאחר מכן — כולל ביטול האישור.',
  'subjectReview.draft.approveError.title': 'הטיוטה הזו לא אושרה',
  'subjectReview.draft.approved':
    'אושר. המערך הזה הוא מעכשיו הגרסה שכל יצירה של הסובייקט הזה מעוגנת אליה, ולא ניתן עוד לשנות אותו.',

  'page.subjects.title': 'סובייקטים',
  'page.subjects.description':
    'האנשים, הדמויות והאובייקטים החוזרים שהפרויקט הזה זיהה לסקירה. אין עדיין חיבור ל-orchestrator.',
  'page.subjectReview.title': 'סקירת סובייקט',
  'page.subjectReview.description':
    'השוואה בין תמונות הרפרנס המועמדות של סובייקט ואישור אלה שמגדירות אותו. אין עדיין חיבור ל-orchestrator.',
  'styles.heading': 'פרופילי סגנון',
  'styles.loading': 'טוען פרופילי סגנון…',
  'styles.error.title': 'לא ניתן לקרוא את פרופילי הסגנון',
  'styles.empty.title': 'אין עדיין פרופילי סגנון',
  'styles.empty.description':
    'פרופיל סגנון מתעד את כללי הפלטה, התאורה, המצלמה, המרקם והתנועה שמולם מיוצרת הפקה. לפרויקט הזה אין עדיין אף אחד — הוסיפו את הראשון.',
  'styles.pinning':
    'פרופיל הוא שושלת, וכל שורה למטה היא גרסה אחת שלו. לאיזו גרסה הפקה מוצמדת אינו מוצג: הפקה רושמת את הגרסה שבה השתמשה, אבל אף מסלול שפורסם אינו מחזיר הפקה, ולכן שום דבר כאן לא יכול לקרוא את הרישום הזה.',
  'styles.truncated':
    'קיימים יותר פרופילי סגנון ממה שמוצג, ולכן ייתכן ששושלת חסרה מהרשימה הזו. כל שושלת שמוצגת קוראת את היסטוריית הגרסאות המלאה שלה, ולכן הספירות למעלה אינן מושפעות.',
  'styles.lineage.unreadable':
    'לא ניתן לקרוא את הגרסאות של השושלת הזו, ולכן כמה יש ואיזו מאושרת אינו ידוע ולא אפס.',
  'styles.lineage.versionCount': 'גרסאות: {count}',
  'styles.lineage.noApproved': 'אין גרסה מאושרת',
  'styles.lineage.approvedIs': 'מאושרת: גרסה {version}',
  'styles.version.label': 'גרסה {version}',
  'styles.version.approved': 'מאושרת',
  'styles.version.context': 'גרסה {version} של {name}',
  'styles.diff.summary': 'מה השתנה מגרסה {version}',
  'styles.diff.none': 'אין הבדלים מגרסה {version}.',
  'styles.diff.removed': 'הוסר',
  'styles.diff.added': 'נוסף',
  'styles.diff.referenceAssetIds': 'נכסי ייחוס',
  'styles.diff.imageGenerationDefaults': 'ברירות מחדל ליצירת תמונה',
  'styles.diff.videoGenerationDefaults': 'ברירות מחדל ליצירת וידאו',
  'styles.approveError.title': 'הגרסה הזו לא אושרה',
  'page.styles.title': 'סגנונות',
  'page.styles.description':
    'הסגנונות הוויזואליים שמולם הפרויקט הזה מייצר, מקובצים לשושלות עם הגרסאות שלהן.',
  'voices.loading': 'טוען קולות…',
  'voices.error.title': 'לא ניתן לקרוא את הקולות',
  'voices.empty.title': 'אין עדיין קולות',
  'voices.empty.description':
    'פרופיל קול הוא מה ששומר על דמות נשמעת כמו עצמה לאורך הפקה. לפרויקט הזה אין עדיין אף אחד — הוסיפו את הראשון.',
  'voices.truncated':
    'קיימים יותר קולות ממה שמוצג. המסך הזה קורא רק את העמוד הראשון, ועימוד עדיין לא נבנה.',
  'voices.onePerSubject':
    'לכל דמות יש בדיוק קול מאושר אחד. יכולות להתקיים כמה טיוטות, וההגבלה נאכפת באישור ולא ביצירה — ולכן טיוטה שנייה מותרת, ואישור שלה יידחה עד שהראשונה תימחק.',
  'voices.noPreview':
    'אי אפשר להאזין לשום דבר כאן. האורקסטרטור אינו מפרסם מסלול לתצוגה מקדימה של סינתזה, ולכן קול נשפט לפי המנוע, המודל והתמלול שלו ולא לפי צליל.',
  'voices.group.subjects': 'משויכים לדמות',
  'voices.group.standalone': 'קריינות ועצמאיים',
  'voices.group.noneForSubjects': 'לאף דמות בפרויקט הזה אין עדיין קול.',
  'voices.group.noneStandalone':
    'אין עדיין קול קריינות או קול עצמאי. קול אינו חייב להיות משויך לדמות.',
  'voices.card.approved': 'מאושר',
  'voices.card.draft': 'טיוטה',
  'voices.card.engine': 'מנוע',
  'voices.card.model': 'מודל',
  'voices.card.language': 'שפה',
  'voices.card.context': 'הקול {name}',
  'voices.approveError.title': 'הקול הזה לא אושר',
  'voices.dictionaries.title': 'מילוני הגייה',
  'voices.dictionaries.error.title': 'לא ניתן לקרוא את מילוני ההגייה',
  'voices.dictionaries.empty.title': 'אין עדיין מילוני הגייה',
  'voices.dictionaries.empty.description':
    'מילון מחזיק שפה אחת של הפרויקט ואת המונחים שההגייה שלהם נדרסת בה.',
  'voices.dictionaries.editNote':
    'לא ניתן לערוך ערך: האורקסטרטור אינו מפרסם מסלול לכך, ולכן שינוי פירושו מחיקה והוספה של ערך מחליף.',
  'voices.entries.none': 'למילון הזה אין ערכים.',
  'voices.dictionaries.add': 'הוספת מילון',
  'voices.dictionaries.add.heading': 'מילון הגייה חדש',
  'voices.dictionaries.add.language.hint':
    'מילון אחד לכל שפה, שנכתבת כתג שפה. מילון שני לשפה שכבר יש לפרויקט הזה נדחה.',
  'voices.dictionaries.add.failed.title': 'המילון לא נוצר',
  'voices.entries.add': 'הוספת ערך',
  'voices.entries.add.heading': 'ערך חדש',
  'voices.entries.add.term': 'מונח',
  'voices.entries.add.term.hint':
    'המילה כפי שהיא מופיעה בתסריט. זהו תוכן, ולכן היא נכתבת בשפה ובכיוון של המילון הזה.',
  'voices.entries.add.phonemes': 'דריסת פונמות',
  'voices.entries.add.phonemes.hint':
    'לא חובה, וזו נוטציה ולא שפה. אפשר להשאיר ריק כדי לרשום את המונח בלעדיה.',
  'voices.entries.add.failed.title': 'הערך לא נוסף',
  'voices.entries.remove': 'הסרה',
  'voices.entries.removeContext': 'הסרת הערך {term}',
  'voices.entries.removing': 'מסיר…',
  'voices.entries.remove.failed.title': 'הערך לא הוסר',
  'voices.entries.unreadable':
    'לא ניתן לקרוא את הערכים של המילון הזה, ולכן זה אינו ידוע ולא ריק.',
  'voices.entries.truncated':
    'המילון הזה מחזיק יותר ערכים מעמוד אחד, והשאר אינם מוצגים.',
  'voices.entries.normalisedAs': 'מתנרמל ל־',
  'page.voices.title': 'קולות',
  'page.voices.description':
    'הקולות הקבועים שבהם הפרויקט הזה מדבר, ומילוני ההגייה שהוא מחזיק. איזה קול משתמש באיזה מילון עדיין אינו מוצג.',
  'locations.loading': 'טוען לוקיישנים…',
  'locations.error.title': 'לא ניתן לקרוא את הלוקיישנים',
  'locations.empty.title': 'אין עדיין לוקיישנים',
  'locations.empty.description':
    'לוקיישן מחזיק את המאפיינים הקבועים ואת ה-plates הקנוניים שמולם ממוסגרת סצנה. לפרויקט הזה אין עדיין אף אחד — הוסיפו את הראשון.',
  'locations.truncated':
    'קיימים יותר לוקיישנים ממה שמוצג. המסך הזה קורא רק את העמוד הראשון, ועימוד עדיין לא נבנה.',
  'locations.coverageNote':
    'סוגי ה-plates הם טקסט פתוח ולא רשימה סגורה, ולכן הכיסוי למטה הוא מה שיש לכל לוקיישן בפועל. ארבעת הסוגים המוצעים הם נקודת התחלה ולא דרישה, וּוריאציית תאורה כמו plate של לילה אינה סוג שהאורקסטרטור מפרסם בכלל.',
  'locations.card.approved': 'מאושר',
  'locations.card.draft': 'טיוטה',
  'locations.card.immutableFeatures': 'מאפיינים קבועים:',
  'locations.card.context': 'הלוקיישן {name}',
  'locations.approveError.title': 'הלוקיישן הזה לא אושר',
  'locations.plates.title': 'כיסוי plates',
  'locations.plates.none':
    'אין plates בכלל, ולכן כל סצנה כאן נפתרת מטקסט ולא מתמונה קנונית.',
  'locations.plates.approved': 'מאושר',
  'locations.plates.draftsOnly': 'אף אחת לא מאושרת — טיוטות: {count}',
  'locations.plates.suggestedMissing':
    'סוגים מוצעים שאין להם עדיין plate — הצעות, לא דרישות:',
  'locations.plates.truncated':
    'ללוקיישן הזה יש יותר plates ממה שעמוד אחד מחזיק, ולכן הכיסוי למעלה מחושב מחלק מהם.',
  'locations.plates.unreadable':
    'לא ניתן לקרוא את ה-plates של הלוקיישן הזה, ולכן הכיסוי אינו ידוע ולא ריק.',
  'page.locations.title': 'לוקיישנים',
  'page.locations.description':
    'הלוקיישנים שמולם הפרויקט הזה מצלם, עם כיסוי ה-plates הקנוניים של כל אחד.',
  'props.loading': 'טוען אביזרים…',
  'props.error.title': 'לא ניתן לקרוא את האביזרים',
  'props.empty.title': 'אין עדיין אביזרים',
  'props.empty.description':
    'אבזר נושא את כללי הרציפות שמולם נבדקת סצנה מאוחרת. לפרויקט הזה אין עדיין אף אחד — הוסיפו את הראשון.',
  'props.truncated':
    'קיימים יותר אביזרים ממה שמוצג. המסך הזה קורא רק את העמוד הראשון, ועימוד עדיין לא נבנה.',
  'props.card.approved': 'מאושר',
  'props.card.draft': 'טיוטה',
  'props.card.owned': 'שייך לדמות',
  'props.card.ownedBy': 'שייך ל־{name}',
  'props.card.continuityRules': 'כללי רציפות',
  'props.card.noContinuityRules':
    'לא נרשמו כללי רציפות, ולכן שום דבר באבזר הזה לא ייבדק בין סצנות.',
  'props.card.appearancesUnavailable':
    'היכן האבזר הזה מופיע אינו מוצג: עובדות רציפות משויכות להפקה ונושאות מזהה ישות ללא טיפוס, ולכן שום דבר שפורסם אינו מקשר אבזר לסצנות שלו.',
  'props.card.context': 'האבזר {name}',
  'props.approveError.title': 'האבזר הזה לא אושר',
  'page.props.title': 'אביזרים',
  'page.props.description':
    'האביזרים שהפרויקט הזה עוקב אחריהם, עם כללי הרציפות שכל אחד נושא.',
  'page.productions.title': 'הפקות',
  'page.productions.description':
    'כל ההפקות בפרויקט הזה, מהתסריט ועד הקאט הסופי. אין עדיין חיבור ל-orchestrator.',
  'page.planner.title': 'תוכנית',
  'page.planner.description':
    'התסריט או תוכנית ההפקה שעליהם מבוססת ההפקה הזו. אין עדיין חיבור ל-orchestrator.',
  'page.storyboard.title': 'סטוריבורד',
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
  'page.sfx.title': 'אפקטים קוליים',
  'page.sfx.description':
    'ספריית האפקטים והאמביינס. היא שייכת להתקנה הזו ולא לפרויקט מסוים, כך שצליל שיובא פעם אחת נעשה בו שימוש חוזר בכל מקום במקום להיחתך שוב.',
  'sfx.loading': 'קורא את ספריית האפקטים…',
  'sfx.error.title': 'לא ניתן היה לקרוא את ספריית האפקטים',
  'sfx.empty.title': 'אין עדיין אפקטים',
  'sfx.empty.description':
    'ייבאו צליל כדי להתחיל את הספרייה. כל רשומה מתעדת מהיכן הגיעה, ובמקרה של ייבוא — תחת איזה רישיון.',
  'sfx.truncated':
    'זהו העמוד הראשון בלבד של האפקטים. למתזמר יש יותר מהרשומים כאן.',
  'sfx.card.approved': 'מאושר',
  'sfx.card.draft': 'טיוטה',
  'sfx.card.category': 'קטגוריה:',
  'sfx.card.tags': 'תגיות:',
  'sfx.card.tags.none': 'אין',
  'sfx.card.origin': 'מקור:',
  'sfx.card.licence': 'רישיון:',
  'sfx.card.licence.none':
    'לא תועד, וזה מותר לפי החוזה רק לצליל שההתקנה הזו יצרה בעצמה.',
  'sfx.card.path': 'קובץ:',
  'sfx.card.hash': 'טביעת אצבע SHA-256:',
  'sfx.card.duration': 'משך:',
  'sfx.card.sampleRate': 'קצב דגימה:',
  'sfx.card.channels': 'ערוצים:',
  'sfx.card.unmeasured': 'לא נמדד',
  'sfx.card.frozen': 'אפקט מאושר קפוא: יש לייבא אחר במקום לערוך אותו.',
  'sfx.card.context': 'האפקט {name}',
  'sfx.card.remove': 'הסרה',
  'sfx.card.removing': 'מסיר…',
  'sfx.card.removeContext': 'הסרת האפקט {name}',
  'sfx.card.remove.failed.title': 'האפקט לא הוסר',
  'sfx.approveError.title': 'האפקט לא אושר',
  'sfx.import.open': 'ייבוא צליל',
  'sfx.import.heading': 'ייבוא צליל',
  'sfx.import.sourcePath': 'נתיב לקובץ',
  'sfx.import.sourcePath.hint':
    'היכן הצליל נמצא במכונה הזו. שום דבר אינו מועלה: המתזמר קורא את הקובץ במקום שבו הוא כבר נמצא.',
  'sfx.import.name': 'שם',
  'sfx.import.category': 'קטגוריה',
  'sfx.import.category.hint':
    'באותיות גדולות עם קווים תחתונים, למשל FOOTSTEPS. הקטגוריות הן שלכם להמציא; שום דבר כאן אינו מספק רשימה.',
  'sfx.import.tags': 'תגיות',
  'sfx.import.tags.hint': 'אחת בכל שורה. לא חובה.',
  'sfx.import.origin': 'מקור',
  'sfx.import.licence': 'רישיון',
  'sfx.import.licence.hint':
    'נדרש לצליל מיובא, מפני שהספרייה מתעדת מה מותר לשלוח. צליל שההתקנה הזו יצרה אינו זקוק לו.',
  'sfx.import.submit': 'ייבוא',
  'sfx.import.submitting': 'מייבא…',
  'sfx.import.failed.title': 'הצליל לא יובא',
  'page.system.description':
    'פרופיל חומרה, מודלים מותקנים, מקום בדיסק, בדיקות מקדימות ומצב ההפעלה של ההתקנה הזו.',
  'form.invalid.required': 'צריך למלא את זה.',
  'form.invalid.tooSmall': 'המספר הזה קטן מדי.',
  'form.invalid.tooBig': 'המספר הזה גדול מדי.',
  'form.invalid.type': 'זה לא סוג הערך שהשדה הזה מקבל.',
  'form.invalid.value': 'החוזה לא יקבל את הערך הזה.',
  'library.add': 'הוספה',
  'library.edit': 'עריכה',
  'library.save': 'שמירת השינויים',
  'library.cancel': 'ביטול',
  'library.saving': 'שומר…',
  'library.creating': 'יוצר…',
  'library.saved': 'נשמר.',
  'library.created': 'נוצר.',
  'library.approved': 'אושר.',
  'library.frozen':
    'הרשומה הזו מאושרת, ולכן היא מוקפאת ואי אפשר לערוך אותה. זה מה שהופך אותה לבטוחה עבור כל מה שכבר מפנה אליה — ההקפאה נאכפת במסד הנתונים, לא במסך הזה.',
  'library.frozen.styleVersion':
    'הגרסה הזו מאושרת, ולכן היא מוקפאת. כדי לערוך אותה, צרו את הגרסה הבאה: הפקות נשארות מוצמדות לגרסה שבה השתמשו, וזו בדיוק הסיבה שאי אפשר לשנות במקום.',
  'library.newVersion': 'יצירת הגרסה הבאה',
  'library.newVersion.title': 'יצירת הגרסה הבאה של הסגנון הזה',
  'library.newVersion.explain':
    'הפעולה פותחת גרסה חדשה באותו שושלת, מועתקת מזו. שום דבר שכבר מוצמד לגרסה קיימת לא זז, והגרסה החדשה מגיעה לא מאושרת.',
  'library.field.name': 'שם',
  'library.field.description': 'תיאור קנוני',
  'library.field.mode': 'מצב סגנון',
  'library.field.mode.hint':
    'מצב בטקסט חופשי שהפרויקט הזה מגדיר. ה-orchestrator מציע כמה; אף אחד אינו ברירת מחדל.',
  'library.field.layoutNotes': 'הערות פריסה',
  'library.field.immutableFeatures': 'מאפיינים בלתי משתנים',
  'library.field.continuityRules': 'כללי רציפות',
  'library.field.displayName': 'שם תצוגה',
  'library.field.engine': 'מנוע',
  'library.field.modelId': 'מזהה מודל',
  'library.field.language': 'תג שפה',
  'library.field.linesHint': 'אחד בכל שורה.',
  'library.field.realismLevel': 'רמת ריאליזם',
  'library.field.paletteRules': 'כללי פלטה',
  'library.field.lightingRules': 'כללי תאורה',
  'library.field.cameraRules': 'כללי מצלמה',
  'library.field.textureRules': 'כללי מרקם',
  'library.field.motionRules': 'כללי תנועה',
  'library.field.prohibitedStyleDrift': 'סטיית סגנון אסורה',
  'library.field.referenceAudioPath': 'אודיו ייחוס, כנתיב יחסי לפרויקט',
  'library.field.referenceTranscript': 'תמלול מדויק של האודיו הזה',
  'library.field.referenceTranscript.hint':
    'הוא חייב להתאים להקלטה מילה במילה. תמלול שסוטה מהאודיו הוא הגורם הנפוץ ביותר לקול שלא נשמע כמו עצמו.',
  'styles.create.open': 'הוספת סגנון',
  'styles.create.title': 'הוספת פרופיל סגנון',
  'styles.edit.title': 'עריכת גרסת הסגנון הזו',
  'voices.create.open': 'הוספת קול',
  'voices.create.title': 'הוספת פרופיל קול',
  'voices.edit.title': 'עריכת פרופיל הקול הזה',
  'locations.create.open': 'הוספת לוקיישן',
  'locations.create.title': 'הוספת לוקיישן',
  'locations.edit.title': 'עריכת הלוקיישן הזה',
  'props.create.open': 'הוספת אביזר',
  'props.create.title': 'הוספת אביזר',
  'props.edit.title': 'עריכת האביזר הזה',
  'productions.heading': 'ההפקות בפרויקט הזה',
  'productions.loading': 'קורא את ההפקות של הפרויקט…',
  'productions.error.title': 'לא ניתן היה לקרוא את רשימת ההפקות',
  'productions.empty.title': 'אין עדיין הפקות',
  'productions.empty.description':
    'הפקה היא יצירה גמורה אחת — פרק, קליפ, טריילר. צרו אחת כדי להתחיל לתכנן אותה.',
  'productions.truncated':
    'ל-orchestrator יש עוד הפקות מעבר לאלה. כאן נקרא רק העמוד הראשון.',
  'productions.card.open': 'פתיחת התוכנית של {title}',
  'productions.card.sequence': 'מספר ברצף:',
  'productions.card.target': 'אורך היעד:',
  'productions.card.tolerance': 'סטייה מותרת:',
  'productions.card.toleranceFromProfile': 'מוצהרת על ידי פרופיל המבנה שלה',
  'productions.card.toleranceUndeclared': 'לא הוצהרה',
  'productions.card.toleranceUndeclared.detail':
    'לא ההפקה הזו ולא פרופיל מבנה כלשהו מצהירים על סטייה מותרת, ולכן ה-orchestrator מסרב לשפוט אם התוכנית מסתכמת. אין ברירת מחדל, כי סטייה שמתאימה לפרק בן עשרים דקות שגויה לטריילר בן שלושים שניות.',
  'productions.card.planVersion': 'גרסת התוכנית:',
  'productions.card.screenplayVersion': 'גרסת התסריט:',
  'productions.card.noScreenplayVersion': 'אין עדיין גרסת תסריט',
  'productions.kind.label': 'סוג',
  'productions.kind.EPISODE': 'פרק',
  'productions.kind.SHORT_FILM': 'סרט קצר',
  'productions.kind.FILM': 'סרט',
  'productions.kind.MUSIC_VIDEO': 'קליפ',
  'productions.kind.TRAILER': 'טריילר',
  'productions.kind.MONTAGE': 'מונטאז׳',
  'productions.kind.NARRATED_STORY': 'סיפור מסופר',
  'productions.kind.CUSTOM': 'סוג מותאם',
  'productions.mode.label': 'מצב נרטיבי',
  'productions.mode.SCREENPLAY': 'תסריט',
  'productions.mode.TREATMENT': 'טריטמנט',
  'productions.mode.MUSIC_DRIVEN': 'מונע מוזיקה',
  'productions.mode.VISUAL_ONLY': 'ויזואלי בלבד',
  'productions.mode.IMPORTED_TIMELINE': 'טיימליין מיובא',
  'productions.mode.CUSTOM': 'מצב מותאם',
  'productions.state.IDEA': 'רעיון',
  'productions.state.OUTLINE_DRAFT': 'טיוטת מתווה',
  'productions.state.OUTLINE_APPROVED': 'המתווה אושר',
  'productions.state.SCREENPLAY_DRAFT': 'טיוטת תסריט',
  'productions.state.SCREENPLAY_APPROVED': 'התסריט אושר',
  'productions.state.PLANNING': 'תכנון',
  'productions.state.STORYBOARDING': 'סטוריבורד',
  'productions.state.STORYBOARD_REVIEW': 'סקירת סטוריבורד',
  'productions.state.AUDIO_RENDER': 'רינדור אודיו',
  'productions.state.VIDEO_RENDER': 'רינדור וידאו',
  'productions.state.SHOT_REVIEW': 'סקירת שוטים',
  'productions.state.ASSEMBLY': 'הרכבה',
  'productions.state.FINAL_QC': 'בקרת איכות סופית',
  'productions.state.COMPLETE': 'הושלמה',
  'productions.state.ARCHIVED': 'בארכיון',
  'productions.create.open': 'הפקה חדשה',
  'productions.create.cancel': 'ביטול',
  'productions.create.heading': 'הפקה חדשה',
  'productions.create.submit': 'יצירת ההפקה',
  'productions.create.submitting': 'יוצר…',
  'productions.create.title': 'כותרת',
  'productions.create.title.hint':
    'איך היצירה הזו נקראת. זהו תוכן, ולכן הוא יכול להיות בכל שפה.',
  'productions.create.logline': 'לוגליין',
  'productions.create.logline.hint':
    'משפט אחד. אפשר להשאיר ריק — שלב תכנון יכול לכתוב אותו אחר כך.',
  'productions.create.brief': 'תקציר',
  'productions.create.brief.hint':
    'פסקה, טריטמנט, נושא לימודי או בריף מוזיקלי. כל מה שהתכנון אמור לצאת ממנו.',
  'productions.create.sequenceNumber': 'מספר ברצף',
  'productions.create.sequenceNumber.hint':
    'להפקה ששייכת לסדר כלשהו, למשל פרק בסדרה.',
  'productions.create.targetRuntime': 'אורך היעד',
  'productions.create.targetRuntime.minutes': 'דקות',
  'productions.create.targetRuntime.seconds': 'שניות',
  'productions.create.targetRuntime.hint':
    'שום דבר כאן לא מניח עשרים דקות. שלושים שניות וארבעים וחמש דקות רגילות באותה מידה.',
  'productions.create.targetRuntime.preview': 'כלומר:',
  'productions.create.tolerance': 'סטייה מותרת בשניות',
  'productions.create.tolerance.hint':
    'כמה רחוק הסכום המתוכנן רשאי לשבת מהיעד לפני שהאישור נדחה. השאירו ריק רק אם פרופיל המבנה שלמטה מצהיר על סטייה — אחרת אין דרך לשפוט את התוכנית בכלל.',
  'productions.create.styleProfile': 'פרופיל סגנון',
  'productions.create.styleProfile.hint':
    'חובה. הפקה מוצמדת לגרסת סגנון אחת לכל חייה.',
  'productions.create.styleProfile.version': 'גרסה {version}',
  'productions.create.productionProfile': 'פרופיל מבנה',
  'productions.create.productionProfile.none': 'בלי פרופיל מבנה',
  'productions.create.productionProfile.hint':
    'רשות. המקטעים החוזרים שלו נספרים לתוך תקציב האורך, והסטייה שהוא מצהיר עליה מחליפה סטייה שההפקה עצמה לא הצהירה.',
  'productions.create.blocked.title': 'הפקה זקוקה קודם לפרופיל סגנון',
  'productions.create.blocked.description':
    'כל הפקה מוצמדת לגרסת סגנון, ולפרויקט הזה עדיין אין אף אחת. צרו את הראשונה בספריית הסגנונות ואז חזרו לכאן.',
  'productions.create.failed.title': 'ההפקה לא נוצרה',
  'productions.edit.context': 'ההפקה {title}',
  'productions.edit.title': 'עריכת ההפקה הזו',
  'productions.edit.explain':
    'נשלחים רק השדות שהשתנו. שינוי שנשמר מזיז את תקציב זמן הריצה ותו לא: אף שלב אינו מורץ מחדש.',
  'productions.edit.cannotClear':
    'משנקבע, אי אפשר לרוקן אותו מכאן: העדכון קורא מפתח חסר כ"להשאיר כמו שהוא" ואין לו דרך לומר "אין". יש להחליף אותו במקום זאת.',
  'productions.edit.modeChange':
    'שינוי כאן משנה אילו שלבים ההפקה צריכה. דבר שכבר תוכנן אינו מורץ מחדש.',
  'productions.edit.failed.title': 'השינויים לא נשמרו',
  'productions.profiles.heading': 'פרופילי מבנה',
  'productions.profiles.explain':
    'צורה לשימוש חוזר שאפשר לקשור אליה הפקה: זמן הריצה המבוקש והסבולת שלה, פורמט הפריים והשמע שלה, והמקטעים שהיא בנויה מהם. אף אחד מהם אינו "הפורמט"; יצירה של שלושים שניות נושאת את שלה.',
  'productions.profiles.loading': 'קורא את פרופילי המבנה של הפרויקט…',
  'productions.profiles.error.title': 'לא ניתן היה לקרוא את פרופילי המבנה',
  'productions.profiles.empty.title': 'אין עדיין פרופיל מבנה',
  'productions.profiles.empty.description':
    'אפשר ליצור הפקה בלעדיו. הוסיפו אחד כאן כדי לתת לכמה הפקות אותה צורה ואותה סבולת.',
  'productions.profiles.truncated':
    'זהו העמוד הראשון בלבד של פרופילי המבנה. למתזמר יש יותר מהרשומים כאן.',
  'productions.profiles.target': 'זמן ריצה מבוקש:',
  'productions.profiles.tolerance': 'סבולת:',
  'productions.profiles.frame': 'פריים:',
  'productions.profiles.frame.value': '{width}×{height} ב־{fps} פריימים לשנייה',
  'productions.profiles.audio': 'שמע:',
  'productions.profiles.audio.value': '{sampleRate} הרץ, {channels} ערוצים',
  'productions.profiles.sections': 'מקטעים:',
  'productions.profiles.sections.value':
    '{count} בסך הכול, {reusable} לשימוש חוזר',
  'productions.profiles.sections.none': 'לא הוצהרו',
  'productions.profiles.create.open': 'פרופיל מבנה חדש',
  'productions.profiles.create.heading': 'פרופיל מבנה חדש',
  'productions.profiles.create.submit': 'יצירת פרופיל מבנה',
  'productions.profiles.create.submitting': 'יוצר…',
  'productions.profiles.create.failed.title': 'פרופיל המבנה לא נוצר',
  'productions.profiles.form.name': 'שם',
  'productions.profiles.form.description': 'תיאור',
  'productions.profiles.form.tolerance': 'סבולת זמן ריצה בשניות',
  'productions.profiles.form.tolerance.hint':
    'כמה רחוק מהיעד מותר להפקה הקשורה לפרופיל הזה לשבת לפני שהתוכנית שלה נדחית. נדרש כאן; הפקה עדיין יכולה להצהיר על סבולת משלה.',
  'productions.profiles.form.format.hint':
    'שום דבר כאן אינו מניח פורמט. כל ערך הוא מה שההפקות הקשורות לפרופיל הזה ירונדרו בו.',
  'productions.profiles.form.fps': 'פריימים לשנייה',
  'productions.profiles.form.width': 'רוחב בפיקסלים',
  'productions.profiles.form.height': 'גובה בפיקסלים',
  'productions.profiles.form.aspectRatio': 'יחס ממדים',
  'productions.profiles.form.aspectRatio.hint':
    'כפי שמתארים את הפריים, למשל 16:9. שום דבר כאן אינו מחשב אותו מהפיקסלים.',
  'productions.profiles.form.sampleRateHz': 'קצב דגימת שמע בהרץ',
  'productions.profiles.form.audioChannels': 'ערוצי שמע',
  'productions.profiles.form.sections': 'מקטעים',
  'productions.profiles.form.sections.hint':
    'לא חובה. כל מקטע משתרע מהתחלה ועד סוף בשניות; שניים יכולים לחלוק גבול אך לא טווח, והמתזמר מסרב לכך. מקטע לשימוש חוזר נספר בתקציב זמן הריצה של כל הפקה הקשורה לפרופיל הזה.',
  'productions.profiles.form.section': 'מקטע {position}',
  'productions.profiles.form.section.label': 'תווית',
  'productions.profiles.form.section.start': 'התחלה בשניות',
  'productions.profiles.form.section.end': 'סוף בשניות',
  'productions.profiles.form.section.reusable': 'לשימוש חוזר',
  'productions.profiles.form.section.reusable.yes': 'כן',
  'productions.profiles.form.section.reusable.no': 'לא',
  'productions.profiles.form.section.add': 'הוספת מקטע',
  'productions.profiles.form.section.remove': 'הסרה',
  'productions.profiles.form.section.removeContext': 'הסרת מקטע {position}',
  'planner.error.title': 'לא ניתן היה לקרוא את ההפקה הזו',
  'planner.loading': 'קורא את ההפקה…',
  'planner.summary.kind': 'סוג:',
  'planner.summary.styleProfile': 'פרופיל סגנון:',
  'planner.summary.styleVersion': 'גרסת סגנון:',
  'planner.summary.styleUnresolved':
    'ההפקה הזו מציינת גרסת סגנון שה-orchestrator לא החזיר.',
  'planner.summary.stylePinned':
    'הפקה נשארת עם גרסת הסגנון שאיתה נוצרה. אישור גרסה מאוחרת יותר של אותו פרופיל אינו מזיז אותה.',
  'planner.summary.mode': 'מצב נרטיבי:',
  'planner.summary.target': 'אורך היעד:',
  'planner.budget.heading': 'האם התוכנית הזו מסתכמת?',
  'planner.budget.loading': 'מסכם את התוכנית…',
  'planner.budget.error.title': 'לא ניתן היה לקרוא את תקציב האורך',
  'planner.budget.undeclared.title': 'שום דבר כאן לא מצהיר על סטייה מותרת',
  'planner.budget.undeclared.description':
    'ה-orchestrator לא ישפוט את התוכנית הזו, כי לא ההפקה ולא פרופיל מבנה אומרים כמה רחוק מהיעד נחשב מספיק קרוב. אין ברירת מחדל: מה שנדיב לפרק בן עשרים דקות הוא כל האורך של טריילר בן שלושים שניות.',
  'planner.budget.verdict.WITHIN_TOLERANCE': 'התוכנית מסתכמת',
  'planner.budget.verdict.SHORT': 'התוכנית קצרה מדי',
  'planner.budget.verdict.LONG': 'התוכנית ארוכה מדי',
  'planner.budget.target': 'יעד:',
  'planner.budget.planned': 'סצנות מתוכננות:',
  'planner.budget.reused': 'חומר חוזר:',
  'planner.budget.total': 'סך הכול:',
  'planner.budget.variance.SHORT': 'חסר:',
  'planner.budget.variance.LONG': 'עודף:',
  'planner.budget.toleranceLabel': 'מותר לכל כיוון:',
  'planner.budget.progress': 'הסכום המתוכנן מול היעד',
  'planner.budget.segments.heading': 'לאן הולך הזמן',
  'planner.budget.segments.empty':
    'להפקה הזו אין סצנות ואין חומר חוזר, ולכן אין מה לסכם. מה שהיא צריכה שיתוכנן מופיע למטה.',
  'planner.budget.segments.duration': 'אורך',
  'planner.budget.segments.share': 'חלק מהיעד',
  'planner.budget.segments.label': 'מקטע',
  'planner.budget.segments.reused': 'חוזר',
  'planner.budget.offMean.heading.SHORT': 'אילו סצנות קצרות מדי',
  'planner.budget.offMean.heading.LONG': 'אילו סצנות ארוכות מדי',
  'planner.budget.offMean.mean': 'הסצנה הממוצעת של התוכנית הזו:',
  'planner.budget.offMean.spread': 'בפריסה שווה, כל סצנה הייתה זזה ב:',
  'planner.budget.offMean.none.SHORT':
    'אף סצנה אינה קצרה מהממוצע של התוכנית הזו, ולכן החוסר פרוס על כולן ולא יושב במקום אחד.',
  'planner.budget.offMean.none.LONG':
    'אף סצנה אינה ארוכה מהממוצע של התוכנית הזו, ולכן העודף פרוס על כולן ולא יושב במקום אחד.',
  'planner.budget.offMean.explain':
    'קוצר נמדד מול הסצנה הממוצעת של התוכנית עצמה, לא מול יעד לכל סצנה — ה-orchestrator לא מפרסם יעד כזה, והמצאת אחד הייתה מספר שהמסך הזה בדה.',
  'planner.budget.reusedNote':
    'חומר חוזר מגיע מהמקטעים החוזרים של פרופיל המבנה. הוא נספר לתוך הסכום ואינו זמן שנכתב מחדש.',
  'planner.stages.heading': 'מה ההפקה הזו צריכה שיתוכנן',
  'planner.stages.loading': 'שואל אילו שלבים ההפקה הזו צריכה…',
  'planner.stages.error.title': 'לא ניתן היה לקרוא את רשימת השלבים',
  'planner.stages.source':
    'הרשימה הזו מגיעה מה-orchestrator, שגוזר אותה מהמצב הנרטיבי של ההפקה. היא אינה מורכבת כאן, ולכן מצב שאינו זקוק לתסריט פשוט אינו כולל שלב תסריט.',
  'planner.stages.blocked':
    'אף אחד מהשלבים האלה אינו ניתן להרצה מהמסך הזה. ל-orchestrator יש שירות תכנון אך אין נתיב מפורסם שמריץ שלב, ולכן תוכנית נכתבת דרך ה-orchestrator ולא כאן.',
  'planner.stages.computed': 'נענה על ידי התקציב שלמעלה',
  'planner.stages.computedNote':
    'זהו חשבון על אורכי הסצנות ולא משהו שמודל כותב, וה-orchestrator מסרב לייצר אותו.',
  'planner.stage.LOGLINE': 'לוגליין',
  'planner.stage.BEAT_SHEET': 'מפת ביטים',
  'planner.stage.MUSIC_SECTIONS': 'מקטעי מוזיקה',
  'planner.stage.VISUAL_BEATS': 'ביטים ויזואליים',
  'planner.stage.SCENE_OUTLINE': 'מתווה סצנות מתוזמן',
  'planner.stage.SCREENPLAY': 'תסריט ודיאלוג',
  'planner.stage.CONTINUITY_REVIEW': 'סקירת רציפות',
  'planner.stage.TONE_REVIEW': 'סקירת קהל וטון',
  'planner.stage.RUNTIME_ESTIMATE': 'הערכת אורך',
  'planner.approval.heading': 'אישור התוכנית',
  'planner.approval.context': 'התוכנית של {title}',
  'planner.approval.ready':
    'התוכנית מסתכמת. אישור שלה מעביר את ההפקה לסטוריבורד, וזו דלת חד-כיוונית עבור השער הזה.',
  'planner.approval.blocked.title': 'האישור נדחה כל עוד התוכנית אינה מסתכמת',
  'planner.approval.blocked.description':
    'ה-orchestrator בודק את התקציב בעצמו, ולכן אין כאן פקד שמוסתר — אותה בקשה בכל דרך אחרת נדחית באותו אופן.',
  'planner.approval.wrongState.title': 'ההפקה הזו אינה בשער התכנון',
  'planner.approval.wrongState.description':
    'אישור תוכנית הוא המעבר החוצה מתכנון, וההפקה הזו נמצאת במקום אחר בחייה. ה-orchestrator מציין לאן הפקה רשאית לעבור כשהוא דוחה מעבר; המסך הזה אינו נושא את המפה הזו, כי ה-orchestrator אינו מפרסם אותה.',
  'planner.approval.approved': 'התוכנית אושרה. ההפקה עברה לשלב הסטוריבורד.',
  'planner.approval.failed.title': 'התוכנית לא אושרה',
  'planner.gaps.heading': 'מה המסך הזה עדיין לא יודע לעשות',
  'planner.gaps.stages':
    'להריץ או להריץ מחדש שלב תכנון. ל-orchestrator יש את השירות והוא מסרב לשלב שהמצב אינו זקוק לו, אך אין נתיב שמגיע אליו.',
  'planner.gaps.scenes':
    'לקרוא, להוסיף או לערוך סצנה. הנתיב היחיד שנוגע בהן מחליף את כל הסט בבת אחת ומחזיר רשימה בלי טיפוס, ולכן המסך הזה רואה סצנה רק כשורה בתקציב שלמעלה.',
  'planner.gaps.dialogue':
    'לכתוב שורת דיאלוג, לבחור לה קול, או לדעת כמה זמן ייקח להגיד אותה. כל הנתיבים האלה קיימים. כולם ממופתחים לפי סצנה, ואין שום נתיב שמוסר למסך הזה מזהה סצנה — אותו נתיב חסר שמופיע בפער הסצנות שלמעלה.',
  'planner.gaps.continuity':
    'להציג ממצאי רציפות או טון ליד הסצנות שהם נוגעים להן. לשניהם יש סכמה ולאף אחד אין נתיב.',
  'page.bible.title': 'ביבל הפרויקט',
  'bible.title': 'ביבל הפרויקט',
  'bible.loading': 'טוען את ביבל הפרויקט',
  'bible.error.title': 'לא ניתן היה לקרוא את ביבל הפרויקט',
  'bible.empty.title': 'לפרויקט הזה עדיין אין ביבל',
  'bible.empty.description':
    'ביבל מתעד מול מה הפקה מתכננת — העולם, הדמויות שבו והצליל שלו. לפרויקט הזה עדיין לא תועד דבר.',
  'bible.versions.title': 'גרסאות',
  'bible.versions.select': 'הצג גרסה {version}',
  'bible.versions.published': 'פורסמה',
  'bible.versions.draft': 'טיוטה',
  'bible.versions.active': 'נוכחית',
  'bible.versions.firstPageOnly':
    'כאן נקרא רק העמוד הראשון של הגרסאות. באורקסטרטור יש יותר ממה שמוצג כאן.',
  'bible.field.notRecorded': 'לא תועד',
  'bible.field.noneRecorded': 'לא תועדו',
  'bible.world.title': 'כללי עולם',
  'bible.world.genre': 'ז׳אנר',
  'bible.world.tone': 'טון',
  'bible.world.audience': 'קהל',
  'bible.world.contentBoundaries': 'גבולות תוכן',
  'bible.world.recurringThemes': 'מוטיבים חוזרים',
  'bible.world.introOutroRules': 'כללי פתיח וסיום',
  'bible.world.continuityConstraints': 'אילוצי רציפות',
  'bible.narrative.title': 'כללים נרטיביים',
  'bible.narrative.notCarried':
    'סוג הפרויקט הזה אינו נושא חלק נרטיבי, ולכן לא ניתן לתעד עליו את הכללים האלה כלל.',
  'bible.narrative.notRecorded':
    'סוג הפרויקט הזה יכול לשאת כללים נרטיביים, ובגרסה הזו לא תועדו כאלה.',
  'bible.narrative.worldRules': 'כללי עולם, פיזיקה וקסם',
  'bible.narrative.humourDramaLanguage': 'שפה של הומור ודרמה',
  'bible.narrative.chronology': 'כרונולוגיה',
  'bible.audio.title': 'כללי אודיו',
  'bible.audio.languages': 'שפות',
  'bible.audio.narratorPolicy': 'מדיניות קריינות',
  'bible.audio.musicIdentity': 'זהות מוזיקלית',
  'bible.audio.recurringMotifs': 'מוטיבים מוזיקליים חוזרים',
  'bible.audio.ambienceRules': 'כללי אווירה',
  'bible.audio.sfxAesthetic': 'אסתטיקה של אפקטי קול',
  'bible.audio.dialogueMusicPriority': 'עדיפות בין דיאלוג למוזיקה',
  'bible.audio.loudnessProfile': 'פרופיל עוצמה',
  'bible.subjects.title': 'כללי הדמויות',
  'bible.subjects.none': 'אף דמות אינה נושאת כללים בגרסה הזו.',
  'bible.subjects.immutableVisualTraits': 'מאפיינים חזותיים קבועים',
  'bible.subjects.allowedVariations': 'וריאציות מותרות',
  'bible.subjects.prohibitedChanges': 'שינויים אסורים',
  'bible.subjects.scaleRelationships': 'יחסי גודל',
  'bible.subjects.wardrobeVariants': 'וריאנטים של תלבושת ומשטח',
  'bible.subjects.behaviourAndPersonality': 'התנהגות ואישיות',
  'bible.subjects.speaks': 'מדברת',
  'bible.subjects.speaks.yes': 'כן',
  'bible.subjects.speaks.no': 'לא',
  'bible.subjects.voiceRules': 'כללי קול',
  'bible.subjects.voiceRules.notApplicable':
    'הדמות הזו אינה מדברת, ולכן כללי קול אינם יכולים לחול עליה.',
  'bible.subjects.editor.explained':
    'בלוק אחד לכל סובייקט שיש לו כללים בתנ״ך. אילו סובייקטים קיימים מגיע מרשימת הסובייקטים של הפרויקט, כך שכלל מוצמד כאן לסובייקט לפי שמו ובחוזה לפי המזהה שלו.',
  'bible.subjects.editor.unreadable':
    'לא ניתן היה לקרוא את הסובייקטים של הפרויקט, ולכן לא ניתן לבחור סובייקט; הכללים שכבר כאן נשמרים כפי שהם.',
  'bible.subjects.editor.firstPageOnly':
    'זהו העמוד הראשון של הסובייקטים בלבד. לאורקסטרטור יש יותר ממה שרשום כאן.',
  'bible.subjects.editor.entry': 'כללי סובייקט {position}',
  'bible.subjects.editor.subject': 'סובייקט',
  'bible.subjects.editor.choose': 'בחר סובייקט',
  'bible.subjects.editor.add': 'הוסף כללים לסובייקט',
  'bible.subjects.editor.remove': 'הסר את הכללים האלה',
  'bible.subjects.editor.removeContext': 'הסר כללי סובייקט {position}',
  'bible.subjects.editor.relationship.with': 'עם',
  'bible.subjects.editor.relationship.description': 'יחס',
  'bible.subjects.editor.relationship.add': 'הוסף יחס',
  'bible.subjects.editor.relationship.addContext':
    'הוסף יחס לכללי סובייקט {entry}',
  'bible.subjects.editor.relationship.remove': 'הסר',
  'bible.subjects.editor.relationship.removeContext':
    'הסר יחס {position} מכללי סובייקט {entry}',
  'bible.subjects.unknown': 'אף סובייקט בפרויקט הזה אינו נושא את המזהה הזה.',
  'bible.subjects.relationships': 'יחסים',
  'bible.create.action': 'התחילו טיוטה',
  'bible.create.next': 'התחילו את הגרסה הבאה',
  'bible.create.title': 'טיוטה חדשה של ביבל הפרויקט',
  'bible.create.explain':
    'אפשר ליצור טיוטה ריקה ולמלא אותה ככל שהפרויקט מתגבש. שום דבר אינו מוקפא עד שהיא מפורסמת, ומספר הגרסה נקבע על ידי האורקסטרטור.',
  'bible.create.prefilled':
    'השדות האלה מתחילים מגרסה {version}. שמירה יוצרת טיוטה חדשה, וגרסה {version} עצמה נשארת כפי שהיא.',
  'bible.edit.action': 'ערכו את הטיוטה הזו',
  'bible.edit.context': 'של ביבל הפרויקט, גרסה {version}',
  'bible.edit.title': 'ערכו את הטיוטה הזו',
  'bible.frozen':
    'הגרסה הזו מפורסמת, ולכן כבר אי אפשר לערוך אותה. התחילו במקום זאת את הגרסה הבאה.',
  'bible.form.styleProfile': 'פרופיל סגנון',
  'bible.form.styleProfile.none': 'ללא',
  'bible.form.styleProfile.unreadable':
    'לא ניתן היה לקרוא את ספריית הסגנונות, ולכן אי אפשר לבחור כאן פרופיל סגנון. כל השאר בטופס הזה עדיין נשמר.',
  'bible.form.styleProfile.firstPageOnly':
    'הרשימה הזו כוללת רק את העמוד הראשון של פרופילי הסגנון. באורקסטרטור יש יותר ממה שמוצג כאן.',
  'bible.form.languages.hint': 'תג שפה אחד בכל שורה.',
  'bible.form.kindUnreadable':
    'לא ניתן היה לקרוא את הפרויקט הזה, ולכן לא ידוע אם סוגו נושא כללי נרטיב. החלק הזה מושמט במקום להיות מוצע במקום שבו האורקסטרטור היה דוחה אותו.',
  'bible.publish.action': 'פרסמו את הגרסה הזו',
  'bible.publish.context': 'פרסמו את הגרסה הזו של ביבל הפרויקט, גרסה {version}',
  'bible.publish.explained':
    'פרסום מקפיא את הגרסה הזו. הפקה שתכננה מולה שומרת על מה שתכננה מולו, ולכן שינוי מאוחר יותר פירושו פרסום הגרסה הבאה ולא עריכה של זו — ואין דרך לבטל את זה.',
  'bible.publish.done': 'פורסמה. זו עכשיו הגרסה שהפקה חדשה מתכננת מולה.',
  'bible.publish.error.title': 'הגרסה הזו לא פורסמה',
  'bible.markdown.title': 'תצוגה מחוללת',
  'bible.markdown.source':
    'האורקסטרטור מחולל את זה מהרשומה המובנית שלמעלה. זו תצוגה ולא המקור, והיא מגיעה בניסוח של האורקסטרטור עצמו ולא בשפת הממשק.',
  'bible.markdown.error.title': 'לא ניתן היה לקרוא את התצוגה המחוללת',
  'bible.gaps.heading': 'מה המסך הזה עדיין לא יכול לעשות',
  'bible.gaps.pin':
    'הפקה מתעדת מול איזו גרסת ביבל היא תכננה. אפשר לקרוא את הקיבוע הזה אך לא לקבוע אותו מכאן: הנתיב שקובע אותו מקבל מבנה בקשה שהאורקסטרטור אינו מפרסם.',
  'bible.gaps.markdownSource':
    'התצוגה המחוללת מוצגת כטקסט ולא כמסמך מעובד. עיבוד שלה היה מחייב הוספת מפענח Markdown, ושום דבר חיצוני אינו מגיע לבאנדל הזה.',
  'storyboard.title': 'סקירת סטוריבורד',
  'storyboard.intro':
    'השער שבין תוכנית מאושרת לבין מאות רינדורים יקרים. שוט שדורש קיפריים מקבל אישור כאן, סצנה אחר סצנה, לפני שמשהו נשלח לווידאו.',
  'storyboard.loading': 'קריאת הסצנות של ההפקה הזו…',
  'storyboard.error.title': 'לא ניתן היה לקרוא את הסצנות של ההפקה הזו',
  'storyboard.empty.title': 'עדיין לא תוכננו סצנות',
  'storyboard.empty.description':
    'הסצנות של הפקה מגיעות ממתאר הסצנות שלה, שנכתב בשלב התכנון. שום דבר במסך הזה אינו יוצר אותן, וכל עוד אינן קיימות אין כאן מה לסקור.',
  'storyboard.scene.label': 'סצנה {order}',
  'storyboard.scene.purpose': 'מטרה',
  'storyboard.scene.emotionalBeat': 'פעימה רגשית',
  'storyboard.scene.timeOfDay': 'שעת היום',
  'storyboard.scene.duration': 'משך יעד',
  'storyboard.scene.continuityIn': 'רציפות בכניסה',
  'storyboard.scene.continuityOut': 'רציפות ביציאה',
  'storyboard.scene.show': 'הצגת השוטים',
  'storyboard.scene.hide': 'הסתרת השוטים',
  'storyboard.scene.toggleContext': 'לסצנה {order}',
  'storyboard.continuity.title': 'עובדות שבתוקף כאן',
  'storyboard.continuity.empty': 'אין עובדות רציפות בתוקף לסצנה הזו.',
  'storyboard.continuity.error':
    'לא ניתן היה לקרוא את עובדות הרציפות לסצנה הזו, ולכן הרשימה הזו אינה קביעה שאין כאלה.',
  'storyboard.shots.loading': 'קריאת השוטים של הסצנה הזו…',
  'storyboard.shots.error': 'לא ניתן היה לקרוא את השוטים של הסצנה הזו.',
  'storyboard.shots.empty': 'לסצנה הזו אין עדיין שוטים.',
  'storyboard.shot.label': 'שוט {order}',
  'storyboard.shot.type': 'סוג שוט',
  'storyboard.shot.duration': 'משך יעד',
  'storyboard.shot.framing': 'מסגור',
  'storyboard.shot.camera': 'מצלמה',
  'storyboard.shot.intent': 'פעולה או כוונה חזותית',
  'storyboard.shot.strategy': 'אסטרטגיית יצירה',
  'storyboard.shot.state': 'מצב',
  'storyboard.shot.continuity': 'דרישות רציפות',
  'storyboard.gate.title': 'שער הווידאו',
  'storyboard.gate.permitted': 'רינדור וידאו מותר לשוט הזה.',
  'storyboard.gate.blocked': 'רינדור וידאו חסום לשוט הזה.',
  'storyboard.gate.requirement': 'דרישת קיפריים',
  'storyboard.gate.waiver': 'קיים ויתור רשום לשוט הזה.',
  'storyboard.gate.error': 'לא ניתן היה לקרוא את שער הווידאו לשוט הזה.',
  'storyboard.frames.title': 'פריימים',
  'storyboard.frames.empty': 'לא נוצרו פריימים של סטוריבורד לשוט הזה.',
  'storyboard.frames.error': 'לא ניתן היה לקרוא את הפריימים של השוט הזה.',
  'storyboard.frame.label': 'ניסיון {attempt}',
  'storyboard.frame.level': 'רמה',
  'storyboard.frame.mode': 'אופן היצירה',
  'storyboard.frame.created': 'נוצר בתאריך',
  'storyboard.frame.approved': 'הפריים הזה הוא הקיפריים המאושר.',
  'storyboard.frame.draftNotApprovable':
    'לא ניתן לאשר טיוטה. רק קיפריים הופך לעוגן להמרת תמונה לווידאו, והאורקסטרטור מסרב לאשר כל דבר אחר — ולכן הפריים הזה אינו מציע אישור במקום להציע כזה שיידחה.',
  'storyboard.frame.noImage':
    'התמונה עצמה אינה מוצגת. האורקסטרטור אינו מפרסם נתיב שמגיש את הבייטים של ארטיפקט, והאפליקציה הזו אינה פונה לשום מקום אחר, ולכן מה שמופיע כאן הוא הרישום של הפריים ולא הפריים עצמו.',
  'storyboard.frame.context': 'את הקיפריים מניסיון {attempt} של שוט {order}',
  'storyboard.approve.done':
    'אושר. הפריים הזה הוא כעת העוגן שכל רינדור וידאו של השוט הזה נבנה ממנו.',
  'storyboard.reject.done':
    'נדחה. שום דבר לא נמחק — השוט הזה עדיין יכול לשאת ניסיון נוסף.',
  'storyboard.approval.error.title': 'ההחלטה הזו לא נרשמה',
  'storyboard.approval.explained':
    'אישור קיפריים הופך אותו לעוגן שכל רינדור וידאו של השוט הזה נבנה ממנו, וזו ההחלטה בעלת המינוף הגבוה ביותר במסך הזה. שום דבר כאן אינו משתנה עד שהאורקסטרטור עונה.',
  'storyboard.compare.action': 'השוואה מול הייחוסים',
  'storyboard.compare.title': 'הפריים הזה מול הייחוסים שלו',
  'storyboard.compare.context':
    'השוואת ניסיון {attempt} של שוט {order} מול הייחוסים שלו',
  'storyboard.compare.candidate': 'ארטיפקט מועמד',
  'storyboard.compare.anchors': 'מעוגן אל',
  'storyboard.compare.noAnchors': 'הפריים הזה אינו רושם עוגנים.',
  'storyboard.compare.error': 'לא ניתן היה לקרוא את ההשוואה הזו.',
  'storyboard.compare.noImages':
    'זו ההשוואה שהאורקסטרטור רושם, ולא שתי התמונות זו לצד זו. היא מציינת לְמה כל עוגן מפנה; שיפוט סטייה בעין דורש נתיב שמגיש את התמונות האלה, ואין כזה.',
  'storyboard.compare.anchor.SUBJECT': 'סובייקט',
  'storyboard.compare.anchor.LOCATION_PLATE': 'לוח מיקום',
  'storyboard.compare.anchor.PROP': 'אביזר',
  'storyboard.level.DRAFT': 'טיוטה',
  'storyboard.level.KEYFRAME': 'קיפריים',
  'storyboard.level.DRAFT.explained':
    'טיוטה זולה, לבדיקת קומפוזיציה ומסגור. אישור שלה אינו זהה לאישור קיפריים.',
  'storyboard.level.KEYFRAME.explained':
    'הפריים שהופך לעוגן להמרת תמונה לווידאו. זה הפריים שהרינדור נבנה עליו.',
  'storyboard.requirement.NOT_REQUIRED': 'לא נדרש',
  'storyboard.requirement.REQUIRED_BY_SUBJECT': 'נדרש בגלל סובייקט קנוני',
  'storyboard.requirement.REQUIRED_BY_USER': 'נדרש על ידי אדם',
  'storyboard.regeneration.SAME_PROMPT_NEW_SEED': 'אותו פרומפט, זרע חדש',
  'storyboard.regeneration.CONTROLLED_PROMPT_REVISION': 'תיקון פרומפט מבוקר',
  'storyboard.regeneration.NEW_KEYFRAME': 'קיפריים חדש',
  'storyboard.regeneration.EXACT_REPLAY': 'שחזור מדויק',
  'storyboard.regeneration.RETAKE_REGION': 'צילום מחדש של אזור',
  'storyboard.shotType.ESTABLISHING': 'שוט פתיחה',
  'storyboard.shotType.WIDE': 'רחב',
  'storyboard.shotType.MEDIUM': 'בינוני',
  'storyboard.shotType.CLOSE_UP': 'תקריב',
  'storyboard.shotType.EXTREME_CLOSE_UP': 'תקריב קיצוני',
  'storyboard.shotType.OVER_SHOULDER': 'מעבר לכתף',
  'storyboard.shotType.TWO_SHOT': 'שוט זוגי',
  'storyboard.shotType.POV': 'נקודת מבט',
  'storyboard.shotType.REACTION': 'תגובה',
  'storyboard.shotType.INSERT': 'שוט משולב',
  'storyboard.shotType.ACTION': 'פעולה',
  'storyboard.shotType.TRACKING': 'עוקב',
  'storyboard.shotType.MONTAGE': 'מונטאז׳',
  'storyboard.shotType.TRANSITION': 'מעבר',
  'storyboard.shotType.HOLD': 'החזקה',
  'storyboard.shotType.LIMITED_ANIMATION': 'הנפשה מוגבלת',
  'storyboard.strategy.TEXT_TO_VIDEO_ENVIRONMENT': 'טקסט לווידאו',
  'storyboard.strategy.IMAGE_TO_VIDEO': 'תמונה לווידאו',
  'storyboard.strategy.KEYFRAME_INTERPOLATION': 'אינטרפולציה בין קיפריימים',
  'storyboard.strategy.LIMITED_ANIMATION_PAN': 'תנועה על גבי סטילס',
  'storyboard.strategy.LIMITED_ANIMATION_HOLD': 'החזקה על גבי סטילס',
  'storyboard.strategy.REUSE_APPROVED_CLIP': 'שימוש חוזר בקליפ מאושר',
  'storyboard.strategy.DFR_ACTION': 'הפניה ישירה לפריים',
  'storyboard.strategy.AUDIO_TO_VIDEO': 'אודיו לווידאו',
  'storyboard.strategy.VIDEO_RETAKE': 'צילום מחדש של וידאו',
  'storyboard.state.PLANNED': 'מתוכנן',
  'storyboard.state.STORYBOARD_PENDING': 'סטוריבורד ממתין',
  'storyboard.state.STORYBOARD_READY': 'סטוריבורד מוכן',
  'storyboard.state.STORYBOARD_APPROVED': 'סטוריבורד מאושר',
  'storyboard.state.AUDIO_PENDING': 'אודיו ממתין',
  'storyboard.state.AUDIO_READY': 'אודיו מוכן',
  'storyboard.state.VIDEO_PENDING': 'וידאו ממתין',
  'storyboard.state.VIDEO_RENDERING': 'וידאו ברינדור',
  'storyboard.state.VIDEO_READY': 'וידאו מוכן',
  'storyboard.state.AUTO_QC': 'בדיקה אוטומטית',
  'storyboard.state.MANUAL_REVIEW': 'ממתין לסקירה',
  'storyboard.state.APPROVED': 'מאושר',
  'storyboard.state.REJECTED': 'נדחה',
  'storyboard.state.RENDER_FAILED': 'הרינדור נכשל',
  'storyboard.state.ASSEMBLED': 'הורכב',
  'storyboard.gaps.heading': 'מה המסך הזה עדיין אינו יכול לעשות',
  'storyboard.gaps.images':
    'אף פריים אינו מוצג כתמונה. ארטיפקט נושא נתיב בתוך הפרויקט, והאורקסטרטור אינו מפרסם נתיב שמגיש את הבייטים שלו — הגעה לקובץ בכל דרך אחרת הייתה מחייבת את האפליקציה לפנות למשהו שאינו האורקסטרטור.',
  'storyboard.gaps.generate':
    'לא ניתן ליצור פריימים מכאן. הנתיב קיים, אך צורת הבקשה שלו אינה מפורסמת דרך החוזה של האורקסטרטור, ולכן אין מול מה לאמת בקשה.',
  'storyboard.gaps.operations':
    'יצירה מחדש, תיקון פרומפט, שינוי מסגור ושינוי הבעה הם כולם נתיבים מפורסמים שצורות הבקשה שלהם אינן, ולכן אף אחד מארבעתם אינו מוצע במקום להיות מוצע ואז מסורב.',
  'storyboard.gaps.keyframeRequirement':
    'לא ניתן לקבוע כאן את דרישת הקיפריים של שוט, ולא ניתן לרשום ויתור, מאותה סיבה: שני הנתיבים מקבלים גוף בקשה שהחוזה אינו מפרסם.',
  'storyboard.gaps.progress':
    'פריימים שעדיין ברינדור אינם מתעדכנים מעצמם. התקדמות מגיעה דרך websocket שהאורקסטרטור אינו מגיש עדיין, ולכן המסך הזה מציג את מה שהיה נכון בקריאה האחרונה.',
  'audio.line.label': 'שורה {order}',
  'audio.line.emotion': 'רגש',
  'audio.line.pace': 'קצב',
  'audio.line.pauseBefore': 'השהיה לפני',
  'audio.line.pauseAfter': 'השהיה אחרי',
  'audio.line.language': 'שפה',
  'audio.line.approved': 'האודיו אושר',
  'audio.line.notApproved': 'לא אושר אודיו',
  'audio.line.measured': 'משך שנמדד',
  'audio.line.noAudioYet':
    'השורה הזאת מעולם לא סונתזה, ולכן אין עדיין מה לאשר.',
  'audio.line.spokenDiffers':
    'מה שנאמר שונה מהשורה הכתובה, משום שהוחל מילון הגייה.',
  'audio.line.spoken': 'נאמר',
  'audio.line.add': 'הוסף שורה',
  'audio.line.edit': 'ערוך',
  'audio.line.delete': 'מחק',
  'audio.line.deleting': 'מוחק…',
  'audio.line.created':
    'השורה נוספה. ניתן לסנתז אותה לאחר שפרופיל הקול שהיא משתמשת בו יאושר.',
  'audio.line.saved':
    'השורה נשמרה. אודיו שכבר היה לה אומר את המילים הישנות עד שתסונתז מחדש.',
  'audio.line.frozen.approved':
    'האודיו של השורה הזאת מאושר, ולכן המילים והתזמון שלה מוקפאים איתו. יש להסיר את האישור כדי לערוך אותה.',
  'audio.line.frozen.voiced':
    'השורה הזאת סונתזה, ולכן לא ניתן למחוק אותה מכאן — הטייקים שלה היו נשארים יתומים. עדיין ניתן לערוך ולסנתז אותה מחדש.',
  'audio.line.form.text': 'טקסט',
  'audio.line.form.language.hint':
    'תג BCP-47 כגון en, he או en-GB. לא ניתן לשנות אותו לאחר יצירת השורה.',
  'audio.line.form.voice': 'קול',
  'audio.line.form.voice.choose': 'בחר קול',
  'audio.line.form.voice.unreadable':
    'לא ניתן היה לקרוא את פרופילי הקול, ולא ניתן ליצור שורה בלעדיהם.',
  'audio.line.form.voice.firstPageOnly':
    'זהו העמוד הראשון של פרופילי הקול בלבד. לאורקסטרטור יש יותר ממה שרשום כאן.',
  'audio.line.form.speaker': 'דובר',
  'audio.line.form.speaker.none': 'ללא דובר',
  'audio.line.form.order': 'מיקום',
  'audio.line.form.order.hint': 'היכן השורה יושבת בסצנה, בספירה מאפס.',
  'audio.line.form.pauseBeforeMs': 'השהיה לפני (מ״ש)',
  'audio.line.form.pauseAfterMs': 'השהיה אחרי (מ״ש)',
  'audio.line.form.frozen':
    'לא ניתן לשנות כאן שפה וקול. אודיו קיים היה מתחיל לסתור את השורה; יש להוסיף שורה חדשה במקום.',
  'audio.takes.title': 'טייקים',
  'audio.takes.error': 'לא ניתן היה לקרוא את הטייקים של השורה הזאת.',
  'audio.takes.empty': 'עדיין לא נוצר טייק לשורה הזאת.',
  'audio.take.label': '{pass}, ניסיון {attempt}',
  'audio.take.current': 'האודיו הנוכחי',
  'audio.take.approvedTake': 'מאושר',
  'audio.take.model': 'מודל',
  'audio.take.seed': 'זרע',
  'audio.take.voiceHash': 'גיבוב של פרופיל הקול',
  'audio.take.audioHash': 'גיבוב של האודיו',
  'audio.take.path': 'קובץ',
  'audio.take.duration': 'משך',
  'audio.take.sampleRate': 'תדר דגימה',
  'audio.take.resampled': 'נדגם מחדש מתוך',
  'audio.take.peak': 'רמת שיא',
  'audio.take.created': 'נוצר',
  'audio.take.pronunciation': 'חריגי הגייה',
  'audio.take.noPlayback':
    'לא ניתן לנגן כאן את הקובץ. האורקסטרטור אינו מגיש נתיב לבייטים של תוצר, ולכן זהו הרישום של האודיו ולא האודיו עצמו.',
  'audio.pass.draft': 'טיוטה',
  'audio.pass.final': 'סופי',
  'audio.pass.draft.explained':
    'טיוטה קיימת כדי למדוד כמה זמן לוקח לומר את השורה, לפני שתזמון השוטים נקבע.',
  'audio.pass.final.explained':
    'גרסה סופית נוצרת מחדש אחרי שהתוכנית מתייצבת, והיא זו שההפקה משתמשת בה.',
  'audio.synthesise.draft': 'צור טיוטה',
  'audio.synthesise.final': 'צור גרסה סופית',
  'audio.synthesise.pending': 'שולח…',
  'audio.synthesise.context': 'לשורה {order}',
  'audio.synthesise.submitted':
    'נשלח. טייק יופיע כאן לאחר שהרינדור יסתיים, וזה אינו מיידי.',
  'audio.synthesise.blocked':
    'האודיו של השורה הזאת מאושר, ולכן לא ניתן לסנתז אותה מחדש. יש להסיר את האישור תחילה.',
  'audio.approve.action': 'אשר את האודיו הזה',
  'audio.approve.context': 'לשורה {order}',
  'audio.approve.done': 'האודיו של השורה הזאת אושר.',
  'audio.unapprove.action': 'הסר אישור',
  'audio.unapprove.done': 'האישור הוסר. ניתן לסנתז את השורה מחדש.',
  'audio.tier.title': 'רמת אנימציה',
  'audio.tier.action': 'שאל איזו רמה',
  'audio.tier.pending': 'בוחר…',
  'audio.tier.editedAcrossShots': 'השורה הזאת נפרסת על יותר משוט אחד',
  'audio.tier.acrossShots.no': 'לא',
  'audio.tier.acrossShots.yes': 'כן',
  'audio.tier.chosen': 'היה יוצא: {tier}',
  'audio.tier.rationale': 'מדוע: {rationale}',
  'audio.tier.audioConditioned': 'מותנה אודיו',
  'audio.tier.rhythmAnimation': 'אנימציה לפי קצב',
  'audio.tier.reactionEditing': 'עריכת תגובות',
  'audio.tier.dubit': 'DubIt',
  'audio.tier.gated':
    'לא ניתן לבקש כאן DubIt. החוזה מסמן אותו כחסום מאחורי בדיקת ביצועי חומרה ומבחן עקביות דמות, והשאלה אם התחנה הזאת עברה אותם אינה מגיעה בחוזה — כך שבקשה עבורו הייתה נשלחת בתקווה בלבד, ומסורבת.',
  'audio.title': 'אודיו של דיאלוג',
  'audio.description':
    'כל שורה מדוברת בהפקה הזאת, הטייקים שנוצרו עבורה, והטייק שאדם אישר.',
  'audio.scenes.error': 'לא ניתן היה לקרוא את הסצנות של ההפקה הזאת.',
  'audio.scenes.loading': 'קורא את הסצנות…',
  'audio.scenes.empty':
    'להפקה הזאת אין עדיין סצנות. יש לתכנן אותה תחילה, והדיאלוג יופיע כאן.',
  'audio.scene.label': 'סצנה {order}',
  'audio.scene.show': 'הצג דיאלוג',
  'audio.scene.hide': 'הסתר דיאלוג',
  'audio.scene.toggleContext': 'לסצנה {order}',
  'audio.lines.error': 'לא ניתן היה לקרוא את הדיאלוג של הסצנה הזאת.',
  'audio.lines.loading': 'קורא את הדיאלוג…',
  'audio.lines.empty': 'בסצנה הזאת אין דיאלוג.',
  'audio.lines.firstPageOnly':
    'זהו העמוד הראשון של הדיאלוג בלבד. לאורקסטרטור יש לסצנה הזאת יותר שורות ממה שמוצג כאן.',
  'audio.timing.title': 'משך ריצה, נמדד מתוך הדיאלוג',
  'audio.timing.explain':
    'תקציב המתכנן נבנה ממשכים שאדם הקליד. כאן נקרא האודיו שנוצר במקום זאת, וכל שוט שניתן מתוזמן מחדש — מה שמשנה את אותם משכים.',
  'audio.timing.run': 'תזמן מחדש מתוך הדיאלוג',
  'audio.timing.running': 'מתזמן מחדש…',
  'audio.timing.noReport': 'טרם הורץ.',
  'audio.timing.measured': 'סצנות שנמדדו: {count}',
  'audio.timing.estimated': 'סצנות שעדיין בהערכה: {count}',
  'audio.timing.estimatedWarning':
    'הסך של סצנה משוערת הוא בקשת הבמאי לאחר הגבלה ולא מדידה, ואינו מדווח כמדידה.',
  'audio.timing.scene': 'סצנה {order}',
  'audio.timing.status.retimed': 'תוזמן מחדש',
  'audio.timing.status.estimated': 'משוער',
  'audio.timing.status.unmeasured': 'לא נמדד',
  'audio.timing.status.noShots': 'אין שוטים',
  'audio.timing.total': 'סך הכול לאחר התזמון',
  'audio.timing.target': 'יעד',
  'audio.tier.field': 'רמה',
  'audio.tier.automatic': 'שהאורקסטרטור יבחר',
  'audio.tier.notStored':
    'זהו חישוב ולא החלטה שנשמרת. האורקסטרטור מחשב את הרמה מהדובר וממספר השוטים בכל פנייה, ואינו שומר דבר — ולכן שום שלב בהמשך אינו קורא אותה, והיא לא תהיה כאן בחזרה.',
  'audio.gaps.tierNotStored':
    'לא ניתן לרשום רמת אנימציה עבור שורה. הנתיב מחשב אחת ומחזיר אותה, ולאורקסטרטור אין עמודה, אין טבלה ואין נתיב קריאה לתשובה.',
  'audio.takes.forLine': 'טייקים לשורה {order}',
  'audio.gaps.heading': 'מה המסך הזה עדיין אינו יכול לעשות',
  'audio.gaps.playback':
    'לא ניתן לנגן אודיו. שום דבר באורקסטרטור אינו מגיש את הבייטים של תוצר, ולכן טייק מוצג כרישום שלו — משך, רמת שיא, גיבובים — ולא כצליל.',
  'audio.gaps.music':
    'פסקול ההפקה, שיבוץ קטעי המוזיקה והלחנה לסצנות אינם כאן. האורקסטרטור אינו מפרסם עבורם שום נתיב.',
  'audio.gaps.sfx':
    'לספריית האפקטים והאמביינס אין נתיבים כלל, ולכן לא ניתן לאנדקס, לשייך, או להציג את מידע הרישוי שהופך אותה לבטוחה לשימוש.',
  'audio.gaps.stems':
    'סטמים והמיקס — דיאלוג, מוזיקה, אפקטים ואמביינס, עם רמות, סולו והשתקה — חסרי נתיבים, ולכן לא ניתן לקבוע כאן שום רמה.',
  'audio.gaps.loudness':
    'מספרי העוצמה שקובעים אם ייצוא קביל אינם מוגשים, ולכן המסך הזה אינו יכול להציג ערך שנמדד מול היעד שלו.',
  'audio.gaps.asr':
    'סבב ה-ASR המייעץ הוא חוזה מפורסם ללא נתיב, ולכן לא ניתן להשוות שורה למה שמנוע זיהוי דיבור שמע.',
  'form.invalid': 'שדות הדורשים תשומת לב: {count}',
  'field.required': 'חובה',
  'shots.title': 'סקירת שוטים',
  'shots.description':
    'כל שוט בהפקה הזאת עם מקומו במחזור החיים, הבדיקות האוטומטיות שנרשמו עליו, והעברתו לסוקר אנושי.',
  'shots.scenes.error': 'לא ניתן היה לקרוא את הסצנות של ההפקה הזאת.',
  'shots.scenes.loading': 'קורא את הסצנות…',
  'shots.scenes.empty':
    'להפקה הזאת אין עדיין סצנות. יש לתכנן אותה תחילה, והשוטים יופיעו כאן.',
  'shots.scene.label': 'סצנה {order}',
  'shots.scene.show': 'הצג שוטים',
  'shots.scene.hide': 'הסתר שוטים',
  'shots.scene.toggleContext': 'לסצנה {order}',
  'shots.list.error': 'לא ניתן היה לקרוא את השוטים של הסצנה הזאת.',
  'shots.list.loading': 'קורא את השוטים…',
  'shots.list.empty': 'בסצנה הזאת אין עדיין שוטים.',
  'shots.list.noneAwaiting': 'אף שוט בסצנה הזאת אינו ממתין לסקירה.',
  'shots.filter.awaiting': 'רק שוטים הממתינים לסקירה',
  'shots.filter.all': 'כל השוטים',
  'shots.shot.label': 'שוט {order}',
  'shots.shot.checks': 'בדיקות אוטומטיות',
  'shots.shot.checksContext': 'לשוט {order}',
  'shots.qc.title': 'בדיקות אוטומטיות',
  'shots.qc.advisory':
    'אוטומטי. הבדיקות האלה מייעצות בלבד ואף אחת מהן אינה אישור — אדם מחליט על השוט, וההחלטה הזאת מופיעה במצב השוט למעלה.',
  'shots.qc.error': 'לא ניתן היה לקרוא את הבדיקות האוטומטיות של השוט הזה.',
  'shots.qc.empty': 'עדיין לא רצה בדיקה אוטומטית על השוט הזה.',
  'shots.qc.run.findings': 'ממצאים שנרשמו: {count}',
  'shots.qc.run.findingsUnstructured':
    'החוזה אינו נותן לממצאים האלה צורה, ולכן הם מוצגים בדיוק כפי שהבודק רשם אותם.',
  'shots.qc.check.observed': 'נצפה',
  'shots.qc.check.expected': 'צפוי',
  'shots.qc.run.provider': 'ספק',
  'shots.qc.run.model': 'מניפסט מודל',
  'shots.qc.run.worker': 'עובד',
  'shots.qc.run.hardware': 'פרופיל חומרה',
  'shots.qc.run.styleVersion': 'גרסת פרופיל סגנון',
  'shots.qc.run.promptSpecVersion': 'גרסת מפרט פרומפט',
  'shots.qc.run.created': 'רץ',
  'shots.review.action': 'שלח לסקירה',
  'shots.review.context': 'לשוט {order}',
  'shots.review.pending': 'שולח…',
  'shots.review.done': 'השוט הזה נמצא עכשיו אצל סוקר.',
  'shots.review.unavailable':
    'סקירה מוצעת לאחר שהווידאו של השוט מוכן והבדיקות האוטומטיות שלו רצו. היכן השוט נמצא עכשיו מוצג במצבו.',
  'shots.qc.kind.technical': 'טכני',
  'shots.qc.kind.subjectConsistency': 'עקביות סובייקט',
  'shots.qc.kind.style': 'סגנון',
  'shots.qc.kind.audio': 'אודיו',
  'shots.qc.kind.production': 'הפקה',
  'shots.qc.outcome.pass': 'עבר',
  'shots.qc.outcome.warn': 'אזהרה',
  'shots.qc.outcome.fail': 'נכשל',
  'shots.qc.outcome.skipped': 'דולג',
  'shots.qc.check.fileExists': 'הקובץ קיים',
  'shots.qc.check.containerDecodes': 'המכל מפוענח',
  'shots.qc.check.videoStream': 'זרם הווידאו הצפוי קיים',
  'shots.qc.check.dimensions': 'הממדים תואמים לפרופיל',
  'shots.qc.check.fpsValid': 'קצב הפריימים תקין',
  'shots.qc.check.duration': 'המשך בתוך הסבילות',
  'shots.qc.check.noZeroByteStream': 'אין זרם באורך אפס',
  'shots.qc.check.audioWhenRequired': 'זרם אודיו קיים כשנדרש',
  'shots.qc.check.finalRuntime': 'משך הריצה הסופי בתוך הסבילות',
  'shots.qc.check.resolution1080': 'הרזולוציה היא 1920×1080',
  'shots.qc.check.fps24': 'קצב הפריימים הוא 24',
  'shots.qc.check.audioPresent': 'יש אודיו',
  'shots.qc.check.audio48kStereo': 'האודיו הוא 48 kHz סטריאו',
  'shots.qc.check.subtitles': 'כתוביות קיימות אם הופעלו',
  'shots.qc.check.noMissingAsset': 'אין נכס חסר בציר הזמן',
  'shots.qc.check.noBlackSegment': 'אין מקטע שחור או חסר',
  'shots.gaps.heading': 'מה המסך הזה עדיין אינו יכול לעשות',
  'shots.gaps.picture':
    'לא ניתן להציג פריים ולא וידאו. שום דבר באורקסטרטור אינו מגיש את הבייטים של תוצר, ולכן לא ניתן לצייר את ההשוואה קנוני-ראשון-אמצע-אחרון שהמסך הזה קיים בשבילה.',
  'shots.gaps.decision':
    'לא ניתן לאשר או לדחות שוט כאן. הנתיב קיים, אך צורת הבקשה שלו אינה מפורסמת דרך החוזה, ולכן ההחלטה נקראת ממצב השוט ולא מתקבלת במסך הזה.',
  'shots.gaps.operations':
    'אף אחד מחמשת מצבי היצירה מחדש אינו ניתן להפעלה כאן, מאותה סיבה: נתיב מפורסם אחד, צורת בקשה אחת שאינה מפורסמת.',
  'shots.gaps.identity':
    'שמונת כללי הזהות הם חוזה מפורסם, אך שום נתיב אינו מחזיר פסק דין לכל כלל עבור שוט. מה שבודק רשם מגיע כממצאים חסרי צורה ומוצג ככזה.',
  'shots.gaps.hero':
    'לא ניתן לסמן שוט גיבור. פרופיל הרינדור שלו נושא את הכוונה, ושום נתיב אינו מגיש פרופיל רינדור.',
  'shots.gaps.attempts':
    'לא ניתן לדפדף בהיסטוריית הניסיונות. שום נתיב אינו מפרט את ניסיונות הרינדור של שוט, ולכן ניסיונות קודמים של שוט שנדחה נשמרים באורקסטרטור אך אינם נגישים מכאן.',
  'shots.gaps.queue':
    'זהו תור סצנה אחת בכל פעם. שום נתיב אינו מפרט את שוטי ההפקה לרוחב סצנות, ולכן כל סצנה נקראת כשפותחים אותה.',
  'error.MUSIC_CUE_NOT_APPROVED':
    'השלב הזה דורש קיו מוזיקלי מאושר, והקיו הזה אינו מאושר. יש לאשר אותו תחילה, או לבחור אחד שכבר מאושר.',
  'error.MUSIC_CUE_IMMUTABLE':
    'הקיו המוזיקלי הזה מאושר ולכן הוא מוקפא — ייתכן שהפקה כבר נבנתה עליו. יש להוסיף את הקיו הבא במקום לערוך את זה.',
  'error.MUSIC_CUE_EXISTS':
    'לפרויקט הזה כבר יש את הקיו הזה. קיו מזוהה לפי האודיו שלו ולא לפי שמו, וכל רינדור הופך לרשומה אחת בספרייה — לכן יש לעדכן את הקיו הקיים, או ליצור טייק נוסף.',
  'error.SFX_ASSET_EXISTS':
    'ספריית האפקטים כבר מכילה בדיוק את האודיו הזה. נכס מזוהה לפי תוכנו ולא לפי שמו, לכן יש להשתמש ברשומה הקיימת במקום לייבא את אותם בייטים פעמיים.',
  'error.SFX_ASSET_IMMUTABLE':
    'נכס האפקטים הזה מאושר ולכן הוא מוקפא — ייתכן שהפקה כבר נבנתה עליו. יש לייבא נכס חדש במקום לערוך את זה.',
  'error.OPENING_ENDING_ASSET_IMMUTABLE':
    'נכס הפתיח או הסיום הזה מאושר ולא ניתן לערוך אותו. יש לייבא גרסה חדשה במקום; הפקות נשארות מוצמדות לגרסה שבה השתמשו.',
  'error.OPENING_ENDING_VERSION_CONFLICT':
    'כותב אחר תפס את מספר הגרסה הזה ראשון. דבר לא השתנה — יש לנסות שוב והגרסה הבאה תוקצה.',
  'error.SFX_ASSET_NOT_APPROVED':
    'השלב הזה דורש נכס SFX מאושר, והנכס הזה אינו מאושר. יש לאשר אותו תחילה, או לבחור אחד שכבר מאושר.',
  'error.AUDIO_TIMELINE_CONFLICT':
    'ציר הזמן של השמע בסצנה הזו אינו מסתדר, ולכן אין מה למקסס. או שלשוטים שלה אין אורך כלל, או ששני חלקי שמע חלוקים על מיקומם; יש לתקן את תכנון הסצנה ולמקסס שוב.',
  'error.SCENE_MIX_MISSING':
    'הפקה מתמקססת מהמיקסים של הסצנות שלה, ולכן כל סצנה צריכה להתמקסס תחילה. לסצנה אחת או יותר אין עדיין מיקס — או שלהפקה אין סצנות כלל.',
  'error.MUSIC_CUE_VARIETY_OVERUSED':
    'הקיו המוזיקלי הזה כבר מוקם פעמים רבות ככל שכלל הגיוון של ההפקה מתיר, ולכן לא מוקם שוב. יש לבחור קיו אחר למיקום הזה.',
  'error.malformedText':
    'האורקסטרטור השיב לבקשה הזו במשהו שאינו המסמך שהתבקש. אי אפשר לסמוך על שום דבר כאן כעל הטקסט של הביבל עצמו.',
};
