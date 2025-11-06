import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface ScannedProduct {
  id: string;
  product_name: string;
  image_url: string | null;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fats: number | null;
  fiber: number | null;
  sugar: number | null;
  sodium: number | null;
  ingredients: string[];
  vitamins_minerals: any;
  ai_analysis: string | null;
  scanned_at: string;
}

const History = () => {
  const [products, setProducts] = useState<ScannedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data, error } = await supabase
        .from('scanned_products')
        .select('*')
        .eq('user_id', user.id)
        .order('scanned_at', { ascending: false });

      if (error) throw error;
      
      setProducts(data || []);
    } catch (error: any) {
      console.error('Load history error:', error);
      toast({
        title: "خطأ",
        description: "تعذر تحميل السجل",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('scanned_products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProducts(products.filter(p => p.id !== id));
      
      toast({
        title: "✅ تم الحذف",
        description: "تم حذف المنتج من السجل",
      });
    } catch (error: any) {
      console.error('Delete error:', error);
      toast({
        title: "خطأ",
        description: "تعذر حذف المنتج",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                📚 سجل المنتجات
              </h1>
              <p className="text-muted-foreground">
                المنتجات التي قمت بمسحها ({products.length})
              </p>
            </div>
            <Button
              onClick={() => navigate('/scan')}
              className="bg-gradient-to-r from-primary to-primary-glow"
            >
              مسح منتج جديد
              <ArrowRight className="mr-2 h-4 w-4" />
            </Button>
          </div>

          {products.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-semibold mb-2 text-foreground">
                لا توجد منتجات بعد
              </h2>
              <p className="text-muted-foreground mb-6">
                ابدأ بمسح منتجك الغذائي الأول
              </p>
              <Button
                onClick={() => navigate('/scan')}
                className="bg-gradient-to-r from-primary to-primary-glow"
              >
                مسح الآن
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <Card key={product.id} className="p-6 hover:shadow-[var(--shadow-card)] transition-all">
                  <div className="flex flex-col md:flex-row gap-6">
                    {product.image_url && (
                      <div className="w-full md:w-48 h-48 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                        <img
                          src={product.image_url}
                          alt={product.product_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-foreground mb-1">
                            {product.product_name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(product.scanned_at).toLocaleDateString('ar-EG', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteProduct(product.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        {product.calories !== null && (
                          <div className="bg-primary/10 rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-primary">
                              {product.calories}
                            </div>
                            <div className="text-xs text-muted-foreground">سعرة</div>
                          </div>
                        )}
                        {product.protein !== null && (
                          <div className="bg-secondary/10 rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-secondary">
                              {product.protein}g
                            </div>
                            <div className="text-xs text-muted-foreground">بروتين</div>
                          </div>
                        )}
                        {product.carbs !== null && (
                          <div className="bg-accent/10 rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-accent">
                              {product.carbs}g
                            </div>
                            <div className="text-xs text-muted-foreground">كربوهيدرات</div>
                          </div>
                        )}
                        {product.fats !== null && (
                          <div className="bg-muted rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-foreground">
                              {product.fats}g
                            </div>
                            <div className="text-xs text-muted-foreground">دهون</div>
                          </div>
                        )}
                      </div>

                      {product.ingredients && product.ingredients.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm font-semibold text-foreground mb-2">المكونات:</p>
                          <div className="flex flex-wrap gap-2">
                            {product.ingredients.slice(0, 5).map((ingredient, idx) => (
                              <Badge key={idx} variant="secondary">
                                {ingredient}
                              </Badge>
                            ))}
                            {product.ingredients.length > 5 && (
                              <Badge variant="outline">
                                +{product.ingredients.length - 5} المزيد
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {product.ai_analysis && (
                        <div className="bg-muted/50 rounded-lg p-3">
                          <p className="text-sm text-foreground">
                            {product.ai_analysis.substring(0, 150)}
                            {product.ai_analysis.length > 150 && '...'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
