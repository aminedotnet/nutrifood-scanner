import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, History, LogOut, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    setIsLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast({
      title: "تم تسجيل الخروج",
      description: "نراك قريباً!",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 pt-8">
            <div className="text-7xl mb-6 animate-bounce">🍎</div>
            <h1 className="text-5xl font-bold text-foreground mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              فحص المنتجات الغذائية
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              احصل على تحليل فوري للقيم الغذائية والمكونات بدقة الذكاء الاصطناعي
            </p>
          </div>

          {/* User Status */}
          {user ? (
            <div className="mb-8 flex items-center justify-between bg-card rounded-lg p-4 shadow-[var(--shadow-card)]">
              <div>
                <p className="text-sm text-muted-foreground">مرحباً بك</p>
                <p className="font-semibold text-foreground">{user.email}</p>
              </div>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-destructive hover:text-destructive"
              >
                <LogOut className="ml-2 h-4 w-4" />
                تسجيل الخروج
              </Button>
            </div>
          ) : (
            <Card className="mb-8 p-6 text-center bg-primary/5 border-primary/20">
              <p className="text-foreground mb-4">
                سجل الدخول لحفظ سجل المنتجات التي تمسحها
              </p>
              <Button
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-primary to-primary-glow"
              >
                تسجيل الدخول / إنشاء حساب
              </Button>
            </Card>
          )}

          {/* Main Actions */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card className="p-8 hover:shadow-[var(--shadow-primary)] transition-all duration-300 cursor-pointer group"
                  onClick={() => user ? navigate('/scan') : navigate('/auth')}>
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Camera className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-3">
                  مسح منتج
                </h2>
                <p className="text-muted-foreground">
                  استخدم الكاميرا لمسح المنتج الغذائي والحصول على تحليل كامل
                </p>
              </div>
            </Card>

            <Card className="p-8 hover:shadow-[var(--shadow-secondary)] transition-all duration-300 cursor-pointer group"
                  onClick={() => user ? navigate('/history') : navigate('/auth')}>
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-secondary to-secondary-glow rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <History className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-3">
                  سجل المنتجات
                </h2>
                <p className="text-muted-foreground">
                  عرض جميع المنتجات التي قمت بمسحها مع تفاصيلها الكاملة
                </p>
              </div>
            </Card>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="font-semibold text-foreground mb-2">تحليل دقيق</h3>
              <p className="text-sm text-muted-foreground">
                تحليل شامل للمكونات والقيم الغذائية
              </p>
            </Card>

            <Card className="p-6 text-center bg-gradient-to-br from-secondary/5 to-secondary/10">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="font-semibold text-foreground mb-2">سريع وسهل</h3>
              <p className="text-sm text-muted-foreground">
                نتائج فورية في ثوانٍ معدودة
              </p>
            </Card>

            <Card className="p-6 text-center bg-gradient-to-br from-accent/5 to-accent/10">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="font-semibold text-foreground mb-2">تفاصيل كاملة</h3>
              <p className="text-sm text-muted-foreground">
                سعرات، بروتين، كربوهيدرات والمزيد
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
