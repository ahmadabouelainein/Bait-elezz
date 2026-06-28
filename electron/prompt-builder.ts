export type FeatureKey =
  | 'wallColors'
  | 'furniturePlacement'
  | 'curtainColor'
  | 'furnitureDimensions'
  | 'woodPlanks'
  | 'upholsteryFabric'
  | 'carpetSelection'
  | 'runners'
  | 'tableaux'

export function buildSystemPrompt(language: 'en' | 'ar'): string {
  if (language === 'ar') {
    return `أنت خبير في التصميم الداخلي ومتخصص في المنازل العربية والخليجية.
تقدم توصيات احترافية ومفصلة حول الألوان والأثاث والديكور.
تجيب دائماً باللغة العربية بأسلوب واضح ومنظم.
استخدم قوائم مرقمة وعناوين فرعية لتنظيم إجاباتك.
عند ذكر الألوان قدّم رمز HEX دائماً.`
  }
  return `You are an expert interior designer specializing in residential spaces.
You have deep knowledge of color theory, furniture ergonomics, materials science, and regional decor traditions.
Provide professional, detailed, actionable recommendations structured with numbered lists and clear subheadings.
Always include HEX codes when recommending colors.`
}

export function buildPrompt(
  feature: string,
  inputs: Record<string, unknown>,
  language: 'en' | 'ar'
): string {
  const ar = language === 'ar'

  switch (feature as FeatureKey) {
    case 'wallColors':
      return ar
        ? `انظر إلى الصورة المرفقة إن وُجدت. لون الجدار الحالي: ${inputs.currentColor}.
اقترح:
1. أفضل 5 ألوان مكملة مع رموز HEX
2. مزيج الألوان المناسب لنوع هذه الغرفة: ${inputs.roomType || 'غرفة المعيشة'}
3. نوع الطلاء الموصى به (نعومة، نوع، علامة تجارية)
4. نصائح لتطبيق الألوان وجدار التمييز`
        : `Examine the attached room image if provided. Current wall color: ${inputs.currentColor}.
Room type: ${inputs.roomType || 'living room'}.
Please suggest:
1. Top 5 complementary wall colors with HEX codes
2. Recommended color scheme for this room type
3. Paint type and finish recommendations
4. Application tips and accent wall ideas`

    case 'furniturePlacement':
      return ar
        ? `أبعاد الغرفة: ${inputs.roomWidth}م × ${inputs.roomLength}م، ارتفاع السقف: ${inputs.ceilingHeight}م.
نوع الغرفة: ${inputs.roomType}. قطع الأثاث: ${inputs.furnitureList}.
مواضع الأبواب والنوافذ: ${inputs.doorsWindows || 'غير محددة'}.
اقترح:
1. أفضل تخطيط للأثاث مع خريطة نصية ASCII واضحة
2. مسارات الحركة المثلى (لا تقل عن 90 سم)
3. بؤرة اهتمام الغرفة
4. أخطاء شائعة يجب تجنبها`
        : `Room: ${inputs.roomWidth}m × ${inputs.roomLength}m, ceiling ${inputs.ceilingHeight}m.
Type: ${inputs.roomType}. Furniture: ${inputs.furnitureList}.
Doors/windows at: ${inputs.doorsWindows || 'not specified'}.
Suggest:
1. Optimal furniture layout with ASCII floor plan
2. Traffic flow paths (minimum 90cm clearance)
3. Focal point strategy
4. Common placement mistakes to avoid`

    case 'curtainColor':
      return ar
        ? `الجدران: ${inputs.wallColor}، الأثاث الرئيسي: ${inputs.mainFurnitureColor}، حجم النافذة: ${inputs.windowSize}.
أوصِ بـ:
1. أفضل 5 ألوان للستائر مع HEX
2. نوع القماش (شير / بلاك آوت / كتان / مخمل)
3. أسلوب التعليق (طوق / ثنية فرنسية / ستارة مسطحة)
4. الطول المثلى والعرض الموصى به`
        : `Walls: ${inputs.wallColor}, main furniture: ${inputs.mainFurnitureColor}, window size: ${inputs.windowSize}.
Recommend:
1. Top 5 curtain colors with HEX codes
2. Fabric type (sheer / blackout / linen / velvet)
3. Hanging style (grommet / pinch pleat / flat panel)
4. Ideal length and recommended width`

    case 'furnitureDimensions':
      return ar
        ? `غرفة ${inputs.roomType}، أبعاد ${inputs.roomWidth}م × ${inputs.roomLength}م، سقف ${inputs.ceilingHeight}م.
قطع الأثاث المطلوبة: ${inputs.furniturePieces}.
لكل قطعة حدد:
1. الأبعاد المثلى (عرض × عمق × ارتفاع بالسنتيمتر)
2. مسافة الفراغ الحر المحيطة بكل قطعة
3. تبرير الأبعاد وعلاقتها بالمساحة`
        : `Room type: ${inputs.roomType}, ${inputs.roomWidth}m × ${inputs.roomLength}m, ${inputs.ceilingHeight}m ceiling.
Furniture pieces needed: ${inputs.furniturePieces}.
For each piece provide:
1. Optimal dimensions (W × D × H in cm)
2. Required clearance space around each piece
3. Reasoning and proportional relationship to the room`

    case 'woodPlanks':
      return ar
        ? `مساحة الأرضية: ${inputs.totalArea} م².
توزيع ألوان الخشب: ${inputs.colorDistribution}.
عرض اللوح: ${inputs.plankWidth} سم، طول اللوح: ${inputs.plankLength} سم.
كثافة الخشب: ${inputs.woodDensity || 700} كغ/م³.
احسب:
1. عدد الألواح لكل لون (مع 10% هدر)
2. الأمتار الطولية لكل لون
3. الوزن التقريبي لكل مجموعة بالكيلوغرام
4. ترتيب التركيب الموصى به والاتجاه`
        : `Floor area: ${inputs.totalArea} sqm.
Color distribution: ${inputs.colorDistribution}.
Plank width: ${inputs.plankWidth}cm, length: ${inputs.plankLength}cm.
Wood density: ${inputs.woodDensity || 700} kg/m³.
Calculate:
1. Number of planks per color (include 10% waste)
2. Linear meters per color
3. Approximate weight per batch in kg
4. Recommended installation sequence and direction`

    case 'upholsteryFabric':
      return ar
        ? `نوع الأثاث: ${inputs.furnitureType}. الاستخدام: ${inputs.usage}.
اللون الحالي للأثاث: ${inputs.currentColor || 'غير محدد'}.
أوصِ بـ:
1. أفضل 3 أقمشة تنجيد (تركيب الخيوط، المتانة، درجة الاستهلاك)
2. ألوان وأنماط مناسبة مع رموز HEX
3. درجة سهولة التنظيف (1-10) ونصائح الصيانة
4. خصائص الحماية المطلوبة`
        : `Furniture type: ${inputs.furnitureType}. Usage level: ${inputs.usage}.
Current furniture color: ${inputs.currentColor || 'not specified'}.
Recommend:
1. Top 3 upholstery fabrics (weave, durability rating, rub count)
2. Suitable colors and patterns with HEX codes
3. Cleanability score (1-10) and maintenance tips
4. Required protective properties`

    case 'carpetSelection':
      return ar
        ? `نوع الغرفة: ${inputs.roomType}. المساحة: ${inputs.area} م².
عدد السكان: ${inputs.occupants}. أطفال/حيوانات أليفة: ${inputs.hasKidsOrPets === 'yes' ? 'نعم' : 'لا'}.
اقترح:
1. أفضل 3 أنواع سجاد (مادة، طول الخيط، كثافة البكسل)
2. ألوان وأنماط مناسبة مع HEX
3. حجم السجادة الأمثل
4. طريقة التثبيت وجدول الصيانة`
        : `Room type: ${inputs.roomType}. Area: ${inputs.area} sqm.
Occupants: ${inputs.occupants}. Kids/pets: ${inputs.hasKidsOrPets === 'yes' ? 'Yes' : 'No'}.
Suggest:
1. Top 3 carpet types (material, pile height, face weight)
2. Suitable colors and patterns with HEX codes
3. Optimal rug dimensions for the space
4. Installation method and maintenance schedule`

    case 'runners':
      return ar
        ? `نوع المنطقة: ${inputs.areaType}. الأبعاد: ${inputs.length}م × ${inputs.width}م.
نمط الديكور: ${inputs.decorStyle}.
أوصِ بـ:
1. مواصفات الرانر المثلى (الأبعاد الدقيقة، المادة، النمط)
2. إكسسوارات مكملة (مزهريات، إضاءة، مرايا، لوحات)
3. ألوان الرانر وعلاقتها بباقي الفراغ مع HEX
4. حلول تثبيت مضادة للانزلاق`
        : `Area type: ${inputs.areaType}. Dimensions: ${inputs.length}m × ${inputs.width}m.
Decor style: ${inputs.decorStyle}.
Recommend:
1. Optimal runner specs (exact dimensions, material, pattern)
2. Complementary accessories (vases, lighting, mirrors, art)
3. Runner colors and relationship to the space with HEX codes
4. Anti-slip fixation solutions`

    case 'tableaux':
      return ar
        ? `لون الجدار: ${inputs.wallColor}. نمط الديكور: ${inputs.style}. مساحة الجدار: ${inputs.wallSize}م.
اقترح:
1. نوع العمل الفني المناسب (مجردة / طبيعة / خط عربي / فوتوغرافيا)
2. عدد اللوحات وأحجامها وترتيبها (تخطيط جاليري)
3. أنواع الإطارات المناسبة (لون ومادة وعمق) مع HEX للألوان
4. ارتفاع التعليق المثلى (قاعدة محور العين 145-152 سم)
5. إضاءة إبراز اللوحات (صبابات، ليد خفي)`
        : `Wall color: ${inputs.wallColor}. Decor style: ${inputs.style}. Wall space: ${inputs.wallSize}m.
Suggest:
1. Artwork type (abstract / nature / calligraphy / photography)
2. Number, sizes, and arrangement (gallery wall layout diagram)
3. Frame styles with HEX color codes (color, material, depth)
4. Optimal hanging height (eye-level rule: 145-152cm center)
5. Picture lighting options (track spots, hidden LED strip)`

    case 'woodPlanksVerify':
      return ar
        ? `الرد السابق للذكاء الاصطناعي عن حساب ألواح الخشب:
---
${inputs.aiResponse}
---

المدخلات الأصلية:
- المساحة الكلية: ${inputs.totalArea} م²
- توزيع الألوان: ${inputs.colorDistribution}
- مقاس اللوح: ${inputs.plankWidth}سم عرض × ${inputs.plankLength}سم طول
- كثافة الخشب: ${inputs.woodDensity} كغ/م³

تحقق رياضياً من الحسابات:
1. هل عدد الألواح صحيح لكل لون؟ (المساحة × النسبة ÷ مساحة اللوح الواحد، ثم أضف 10% هدر)
2. هل مجموع النسب المئوية يساوي 100%؟
3. هل حسابات الوزن دقيقة؟ (الحجم × الكثافة)

ابدأ ردك بـ "✓ صحيح" إذا كانت جميع الحسابات سليمة، أو "⚠ يوجد أخطاء" إذا وجدت مشكلات. ثم اشرح النتيجة باختصار.`
        : `Previous AI response for wood plank calculation:
---
${inputs.aiResponse}
---

Original inputs:
- Total floor area: ${inputs.totalArea} m²
- Color distribution: ${inputs.colorDistribution}
- Plank size: ${inputs.plankWidth}cm wide × ${inputs.plankLength}cm long
- Wood density: ${inputs.woodDensity} kg/m³

Verify the mathematics:
1. Are plank counts correct per color? (area × percentage ÷ plank area, then +10% waste)
2. Do the color percentages sum to 100%?
3. Are weight calculations accurate? (volume × density)

Start your response with exactly "✓ VERIFIED" if all calculations are correct, or "⚠ ISSUES FOUND" if errors are present. Then briefly explain your findings.`

    default:
      return ar
        ? 'قدم توصيات تصميم داخلي احترافية بناءً على المعلومات والصورة المرفقة.'
        : 'Provide professional interior design recommendations based on the provided information and image.'
  }
}
