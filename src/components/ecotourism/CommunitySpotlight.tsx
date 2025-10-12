import { Users, Award, MapPin, Heart } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

interface CommunitySpotlightProps {
  partners: string[]
}

const CommunitySpotlight = ({ partners }: CommunitySpotlightProps) => {
  // Mock community partner data - in a real app, this would come from the database
  const communityProfiles = [
    {
      name: "Kumari Silva",
      role: "Local Guide & Conservationist",
      organization: "Kosgoda Turtle Sanctuary",
      location: "Kosgoda Beach",
      avatar: "/placeholder.svg",
      bio: "Marine biologist with 15 years of experience in turtle conservation. Kumari leads our educational programs and nest monitoring activities.",
      achievements: ["Turtle Conservation Award 2023", "Community Leadership Certificate"],
      languages: ["English", "Sinhala", "Tamil"]
    },
    {
      name: "Pradeep Fernando",
      role: "Organic Farmer & Educator",
      organization: "Kandy Organic Farmers Collective",
      location: "Kandy Hills",
      avatar: "/placeholder.svg",
      bio: "Third-generation farmer who transitioned to organic methods. Teaches sustainable agriculture and hosts farm-to-table experiences.",
      achievements: ["Organic Certification", "Best Practices Award"],
      languages: ["English", "Sinhala"]
    },
    {
      name: "Nimal Rajapakse",
      role: "Forest Guide & Naturalist",
      organization: "Sinharaja Eco-Lodge",
      location: "Sinharaja Forest Reserve",
      avatar: "/placeholder.svg",
      bio: "Expert naturalist and bird guide with deep knowledge of endemic species. Leads wildlife monitoring and reforestation projects.",
      achievements: ["Wildlife Guide Certification", "Endemic Species Research"],
      languages: ["English", "Sinhala"]
    }
  ]

  // Filter profiles based on partners mentioned
  const relevantProfiles = communityProfiles.filter(profile => 
    partners.some(partner => 
      partner.toLowerCase().includes(profile.organization.toLowerCase()) ||
      partner.toLowerCase().includes(profile.location.toLowerCase())
    )
  )

  // If no relevant profiles found, show the first few as examples
  const displayProfiles = relevantProfiles.length > 0 ? relevantProfiles : communityProfiles.slice(0, 2)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-600" />
            Community Partners
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {partners.map((partner, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-blue-900">{partner}</div>
                  <div className="text-sm text-blue-700">Community Partner</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="w-5 h-5 mr-2 text-orange-600" />
            Meet Your Local Guides
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {displayProfiles.map((profile, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={profile.avatar} alt={profile.name} />
                    <AvatarFallback>
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-lg">{profile.name}</h4>
                        <p className="text-primary font-medium">{profile.role}</p>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          {profile.location}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">{profile.bio}</p>
                    
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium">Organization: </span>
                        <span className="text-sm text-muted-foreground">{profile.organization}</span>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium">Languages: </span>
                        <div className="inline-flex gap-1 mt-1">
                          {profile.languages.map((lang, langIndex) => (
                            <Badge key={langIndex} variant="outline" className="text-xs">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium">Achievements: </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {profile.achievements.map((achievement, achIndex) => (
                            <Badge key={achIndex} variant="secondary" className="text-xs">
                              <Award className="w-3 h-3 mr-1" />
                              {achievement}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-4 bg-orange-50 rounded-lg">
            <h4 className="font-semibold text-orange-800 mb-2">Why Local Guides Matter</h4>
            <p className="text-sm text-orange-700">
              Our local guides are the heart of every eco tour. They share deep cultural knowledge, 
              support their families through tourism, and are passionate advocates for conservation. 
              By choosing our tours, you directly support these community leaders and their initiatives.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CommunitySpotlight