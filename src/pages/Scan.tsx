import { useState } from "react";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Camera as CameraIcon, ImageIcon, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Scan = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const analyzeImage = async (imageBase64: string) => {
    setIsAnalyzing(true);
    
    try {
      const { data: functionData, error: functionError } = await supabase.functions.invoke(
        'analyze-food-product',
        {
          body: { imageBase64 }
        }
      );

      if (functionError) {
        console.error('Function error:', functionError);
        throw functionError;
      }

      if (!functionData) {
        throw new Error('لم يتم الحصول على نتيجة من التحليل');
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "خطأ",
          description: "يجب تسجيل الدخول أولاً",
          variant: "destructive",
        });
        navigate('/auth');
        return;
      }

      // Save to database
      const { error: insertError } = await supabase
        .from('scanned_products')
        .insert({
          user_id: user.id,
          product_name: functionData.product_name || 'منتج غذائي',
          image_url: imageBase64,
          calories: functionData.calories,
          protein: functionData.protein,
          carbs: functionData.carbs,
          fats: functionData.fats,
          fiber: functionData.fiber,
          sugar: functionData.sugar,
          sodium: functionData.sodium,
          ingredients: functionData.ingredients || [],
          vitamins_minerals: functionData.vitamins_minerals || {},
          ai_analysis: functionData.ai_analysis,
        });

      if (insertError) {
        console.error('Insert error:', insertError);
        throw insertError;
      }

      toast({
        title: "✅ تم التحليل بنجاح",
        description: "تم حفظ المنتج في السجل",
      });

      navigate('/history');

    } catch (error: any) {
      console.error('Analysis error:', error);
      toast({
        title: "خطأ في التحليل",
        description: error.message || "حدث خطأ أثناء تحليل الصورة",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const takePicture = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
      });

      if (image.base64String) {
        const imageBase64 = `data:image/${image.format};base64,${image.base64String}`;
        await analyzeImage(imageBase64);
      }
    } catch (error: any) {
      console.error('Camera error:', error);
      toast({
        title: "خطأ في الكاميرا",
        description: error.message || "تعذر فتح الكاميرا",
        variant: "destructive",
      });
    }
  };

  const pickFromGallery = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Photos,
      });

      if (image.base64String) {
        const imageBase64 = `data:image/${image.format};base64,${image.base64String}`;
        await analyzeImage(imageBase64);
      }
    } catch (error: any) {
      console.error('Gallery error:', error);
      toast({
        title: "خطأ في اختيار الصورة",
        description: error.message || "تعذر اختيار الصورة",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-3">
              🔍 مسح المنتج
            </h1>
            <p className="text-lg text-muted-foreground">
              التقط صورة أو اختر من المعرض لتحليل المنتج الغذائي
            </p>
          </div>

          <Card className="p-8 shadow-[var(--shadow-card)]">
            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
                <p className="text-xl font-semibold text-foreground mb-2">
                  جاري تحليل المنتج...
                </p>
                <p className="text-muted-foreground">
                  يرجى الانتظار بينما نحلل صورة المنتج
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-12 text-center">
                  <CameraIcon className="h-24 w-24 mx-auto mb-4 text-primary" />
                  <p className="text-lg text-foreground">
                    استخدم الكاميرا أو اختر صورة من معرض الصور
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    size="lg"
                    onClick={takePicture}
                    className="h-20 text-lg bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 transition-all duration-300 shadow-[var(--shadow-primary)]"
                  >
                    <CameraIcon className="ml-3 h-6 w-6" />
                    التقط صورة
                  </Button>

                  <Button
                    size="lg"
                    variant="secondary"
                    onClick={pickFromGallery}
                    className="h-20 text-lg bg-gradient-to-r from-secondary to-secondary-glow hover:opacity-90 transition-all duration-300 shadow-[var(--shadow-secondary)]"
                  >
                    <ImageIcon className="ml-3 h-6 w-6" />
                    اختر من المعرض
                  </Button>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    💡 تأكد من وضوح الصورة وظهور جدول القيم الغذائية
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Scan;
