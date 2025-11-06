import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();
    
    if (!imageBase64) {
      throw new Error('Image data is required');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Analyzing food product image...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `أنت خبير تغذية متخصص في تحليل المنتجات الغذائية. قم بتحليل صورة المنتج الغذائي واستخرج المعلومات التالية بدقة:
1. اسم المنتج
2. قائمة المكونات (ingredients) كاملة
3. القيم الغذائية لكل 100 جرام:
   - السعرات الحرارية (calories)
   - البروتين (protein) بالجرام
   - الكربوهيدرات (carbs) بالجرام
   - الدهون (fats) بالجرام
   - الألياف (fiber) بالجرام
   - السكر (sugar) بالجرام
   - الصوديوم (sodium) بالمليجرام
4. الفيتامينات والمعادن (vitamins_minerals) إن وجدت
5. تحليل صحي موجز للمنتج

أعط الإجابة بصيغة JSON فقط بدون أي نص إضافي:`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'حلل هذه الصورة للمنتج الغذائي وأعطني المعلومات الغذائية الكاملة'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64
                }
              }
            ]
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'تم تجاوز حد الطلبات. يرجى المحاولة لاحقاً.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'يرجى إضافة رصيد إلى حسابك في Lovable AI.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    console.log('AI Response:', aiResponse);

    // Parse the JSON response from AI
    let analysisResult;
    try {
      // Try to extract JSON from the response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
      } else {
        // If no JSON found, create a basic structure with the text response
        analysisResult = {
          product_name: 'منتج غذائي',
          ai_analysis: aiResponse,
          calories: null,
          protein: null,
          carbs: null,
          fats: null,
          fiber: null,
          sugar: null,
          sodium: null,
          ingredients: [],
          vitamins_minerals: {}
        };
      }
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      analysisResult = {
        product_name: 'منتج غذائي',
        ai_analysis: aiResponse,
        calories: null,
        protein: null,
        carbs: null,
        fats: null,
        fiber: null,
        sugar: null,
        sodium: null,
        ingredients: [],
        vitamins_minerals: {}
      };
    }

    return new Response(
      JSON.stringify(analysisResult),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in analyze-food-product:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'حدث خطأ في التحليل'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
