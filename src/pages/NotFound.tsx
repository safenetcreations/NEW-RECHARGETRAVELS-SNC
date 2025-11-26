
import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  ArrowLeft, 
  MapPin, 
  Camera, 
  Plane, 
  Compass,
  Search,
  Heart,
  Star,
  Phone,
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const NotFound = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    setIsVisible(true);
  }, [location.pathname]);

  const popularDestinations = [
    { name: "Sigiriya", icon: MapPin, href: "/destinations/sigiriya" },
    { name: "Ella", icon: Camera, href: "/destinations/ella" },
    { name: "Galle", icon: Plane, href: "/destinations/galle" },
    { name: "Kandy", icon: Heart, href: "/destinations/kandy" }
  ];

  const quickActions = [
    { name: "Explore Tours", icon: Compass, href: "/tours", color: "from-blue-500 to-blue-600" },
    { name: "Find Hotels", icon: Star, href: "/hotels", color: "from-green-500 to-green-600" },
    { name: "Travel Guide", icon: Search, href: "/travel-guide", color: "from-purple-500 to-purple-600" },
    { name: "Contact Us", icon: Phone, href: "/contact", color: "from-orange-500 to-orange-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-teal-400/10 to-emerald-600/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center max-w-4xl mx-auto"
            >
              {/* Main 404 Content */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-12"
              >
                <motion.div
                  className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent mb-6"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  404
                </motion.div>
                
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
                >
                  Oops! Page Not Found
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto"
                >
                  The adventure you're looking for seems to have wandered off! 
                  But don't worry - Sri Lanka's wonders are still waiting for you. 
                  Let's get you back on track to discover amazing destinations.
                </motion.p>
              </motion.div>

              {/* Quick Actions Grid */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
              >
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group">
                      <CardContent className="p-6 text-center">
                        <Link to={action.href} className="block">
                          <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                            <action.icon className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {action.name}
                          </h3>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              {/* Popular Destinations */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="mb-12"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Popular Destinations
                </h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {popularDestinations.map((destination, index) => (
                    <motion.div
                      key={destination.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Button
                        asChild
                        variant="outline"
                        className="rounded-full px-6 py-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300"
                      >
                        <Link to={destination.href}>
                          <destination.icon className="w-4 h-4 mr-2" />
                          {destination.name}
                        </Link>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Main Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.6 }}
                className="space-y-4 max-w-md mx-auto"
              >
                <Button asChild className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  <Link to="/">
                    <Home className="w-5 h-5 mr-2" />
                    Return to Home
                  </Link>
                </Button>
                
                <Button 
                  variant="outline" 
                  asChild 
                  className="w-full h-12 border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 font-semibold rounded-xl transition-all duration-300"
                >
                  <Link to="/tours">
                    <Compass className="w-5 h-5 mr-2" />
                    Explore All Tours
                  </Link>
                </Button>
              </motion.div>

              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 2 }}
                className="mt-12 pt-8 border-t border-gray-200"
              >
                <p className="text-gray-600 mb-4">
                  Need help finding your perfect adventure?
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>+94 11 234 5678</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>info@rechargetravels.lk</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NotFound;
