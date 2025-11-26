
import { Card, CardContent } from '@/components/ui/card'
import { Star } from 'lucide-react'

const HoneymoonTestimonials = () => {
  const testimonials = [
    {
      quote: "Our trip was an absolute dream. We started with the misty hills and tea trails at Ceylon Tea Trails, which was pure magic, and ended on the most beautiful beach in a private villa at Cape Weligama. The entire journey was seamless. Our guide, Roshan, was incredible and showed us so many hidden gems we would never have found on our own. We couldn't have planned a more perfect honeymoon.",
      author: "Emily & James",
      location: "London, UK",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
      rating: 5
    },
    {
      quote: "We wanted a mix of adventure and relaxation, and Sri Lanka delivered beyond our wildest expectations! The leopard safari in Yala was a definite highlight—seeing one up close was breathtaking. But the private candlelit dinner on the beach arranged by Anantara Peace Haven was the most romantic night of our lives. Building our own package online was so easy and made the trip feel truly ours. Thank you for everything!",
      author: "Aisha & Omar",
      location: "Dubai, UAE", 
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
      rating: 5
    },
    {
      quote: "From climbing Sigiriya Rock at sunrise to the unforgettable train ride to Ella, every day was a new adventure. What made it truly special was the flexibility. We decided on a whim to take a cooking class, and our guide arranged it for us the very next day. The service was exceptional from start to finish. We are already planning our anniversary trip back!",
      author: "Chloe & Liam",
      location: "Sydney, Australia",
      image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=300&q=80",
      rating: 5
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-rose-50 to-white">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl tracking-tight mb-4">Love Stories from Paradise</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from couples who have experienced the magic of a bespoke Sri Lankan honeymoon
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white rounded-xl shadow-lg border-0 hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <CardContent className="p-0">
                {/* Profile Image */}
                <div className="relative h-20 bg-gradient-to-r from-rose-400 to-rose-500">
                  <img 
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="absolute -bottom-8 left-6 w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                </div>
                
                <div className="pt-12 pb-6 px-6">
                  {/* Rating Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  {/* Quote */}
                  <blockquote className="text-gray-700 leading-relaxed mb-6 italic">
                    "{testimonial.quote}"
                  </blockquote>
                  
                  {/* Author */}
                  <div>
                    <div className="font-semibold text-rose-900">{testimonial.author}</div>
                    <div className="text-sm text-gray-500">{testimonial.location}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HoneymoonTestimonials
