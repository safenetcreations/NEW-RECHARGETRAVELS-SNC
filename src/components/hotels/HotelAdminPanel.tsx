import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import {
  Plus, Edit, Trash2, Search, Filter, Star, MapPin,
  Upload, Save, X, Eye, CheckCircle, AlertCircle,
  Building, Users, Calendar, DollarSign, Download,
  FileText, UploadCloud, AlertTriangle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Hotel } from '@/types/hotel'
import { httpsCallable } from 'firebase/functions'
import { functions } from '@/lib/firebase'

interface HotelAdminPanelProps {
  hotels: Hotel[]
  onSaveHotel: (hotel: Hotel) => void
  onDeleteHotel: (hotelId: string) => void
  onUpdateHotel: (hotel: Hotel) => void
}

const HotelAdminPanel: React.FC<HotelAdminPanelProps> = ({
  hotels,
  onSaveHotel,
  onDeleteHotel,
  onUpdateHotel
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedHotels, setSelectedHotels] = useState<string[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null)
  const [formData, setFormData] = useState<Partial<Hotel>>({
    name: '',
    description: '',
    address: '',
    city_id: '',
    star_rating: 3,
    base_price_per_night: 0,
    amenities: [],
    images: [],
    is_active: true,
    average_rating: 0,
    review_count: 0
  })

  // Bulk import state
  const [showBulkImport, setShowBulkImport] = useState(false)
  const [importData, setImportData] = useState('')
  const [importFormat, setImportFormat] = useState<'json' | 'csv'>('json')
  const [importProgress, setImportProgress] = useState(0)
  const [importResults, setImportResults] = useState<any>(null)
  const [isImporting, setIsImporting] = useState(false)

  const [stats, setStats] = useState({
    totalHotels: 0,
    activeHotels: 0,
    averageRating: 0,
    totalBookings: 0
  })

  useEffect(() => {
    // Calculate stats
    const activeHotels = hotels.filter(h => h.is_active)
    const avgRating = hotels.length > 0
      ? hotels.reduce((sum, h) => sum + (h.average_rating || 0), 0) / hotels.length
      : 0

    setStats({
      totalHotels: hotels.length,
      activeHotels: activeHotels.length,
      averageRating: avgRating,
      totalBookings: hotels.reduce((sum, h) => sum + (h.review_count || 0), 0)
    })
  }, [hotels])

  const filteredHotels = hotels.filter(hotel => {
    const matchesSearch = hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.city?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'active' && hotel.is_active) ||
      (filterStatus === 'inactive' && !hotel.is_active)
    return matchesSearch && matchesStatus
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      amenities: checked
        ? [...(prev.amenities || []), amenity]
        : (prev.amenities || []).filter(a => a !== amenity)
    }))
  }

  const handleImageUpload = (files: FileList) => {
    // In a real app, this would upload to a server
    const newImages = Array.from(files).map((file, index) => ({
      id: `temp_${Date.now()}_${index}`,
      hotel_id: editingHotel?.id || 'temp',
      image_url: URL.createObjectURL(file),
      caption: file.name,
      is_primary: false,
      sort_order: (formData.images?.length || 0) + index
    }))

    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), ...newImages]
    }))
  }

  const handleSaveHotel = () => {
    if (!formData.name || !formData.description) {
      alert('Please fill in all required fields')
      return
    }

    const hotelData: Hotel = {
      ...formData,
      id: editingHotel?.id || `hotel_${Date.now()}`,
      created_at: editingHotel?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    } as Hotel

    if (editingHotel) {
      onUpdateHotel(hotelData)
    } else {
      onSaveHotel(hotelData)
    }

    setIsAddDialogOpen(false)
    setEditingHotel(null)
    setFormData({
      name: '',
      description: '',
      address: '',
      city_id: '',
      star_rating: 3,
      base_price_per_night: 0,
      amenities: [],
      images: [],
      is_active: true,
      average_rating: 0,
      review_count: 0
    })
  }

  const handleEditHotel = (hotel: Hotel) => {
    setEditingHotel(hotel)
    setFormData(hotel)
    setIsAddDialogOpen(true)
  }

  const handleDeleteHotel = (hotelId: string) => {
    if (window.confirm('Are you sure you want to delete this hotel?')) {
      onDeleteHotel(hotelId)
    }
  }

  const handleBulkDelete = () => {
    if (selectedHotels.length === 0) return
    if (window.confirm(`Are you sure you want to delete ${selectedHotels.length} hotels?`)) {
      selectedHotels.forEach(id => onDeleteHotel(id))
      setSelectedHotels([])
    }
  }

  const toggleHotelStatus = (hotel: Hotel) => {
    onUpdateHotel({ ...hotel, is_active: !hotel.is_active })
  }

  // Bulk import functions
  const handleBulkImport = async () => {
    if (!importData.trim()) {
      alert('Please provide import data')
      return
    }

    setIsImporting(true)
    setImportProgress(0)
    setImportResults(null)

    try {
      let hotelsToImport = []

      if (importFormat === 'json') {
        hotelsToImport = JSON.parse(importData)
        if (!Array.isArray(hotelsToImport)) {
          throw new Error('JSON data must be an array of hotels')
        }
      } else if (importFormat === 'csv') {
        hotelsToImport = parseCSV(importData)
      }

      console.log(`📥 Importing ${hotelsToImport.length} hotels...`)

      // Call Firebase function for bulk import
      const bulkImportHotels = httpsCallable(functions, 'bulkImportHotels')
      const result = await bulkImportHotels({
        hotels: hotelsToImport,
        format: importFormat,
        options: { overwrite: false }
      })

      setImportResults(result.data)
      setImportProgress(100)

      // Refresh hotels list
      if (result.data.success) {
        // You might want to refresh the hotels list here
        console.log('✅ Bulk import completed successfully')
      }

    } catch (error: any) {
      console.error('❌ Bulk import failed:', error)
      setImportResults({
        success: false,
        error: error.message,
        results: { success: 0, failed: 0, errors: [error.message] }
      })
    } finally {
      setIsImporting(false)
    }
  }

  const parseCSV = (csvText: string) => {
    const lines = csvText.trim().split('\n')
    if (lines.length < 2) throw new Error('CSV must have at least a header row and one data row')

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
    const hotels = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
      const hotel: any = {}

      headers.forEach((header, index) => {
        const value = values[index]
        switch (header.toLowerCase()) {
          case 'name':
            hotel.name = value
            break
          case 'description':
            hotel.description = value
            break
          case 'address':
            hotel.address = value
            break
          case 'star_rating':
          case 'stars':
            hotel.star_rating = parseInt(value) || 3
            break
          case 'base_price':
          case 'price':
            hotel.base_price_per_night = parseFloat(value) || 0
            break
          case 'city':
            hotel.city = { name: value, country: 'Sri Lanka' }
            break
          case 'amenities':
            hotel.amenities = value ? value.split(';').map((a: string) => a.trim()) : []
            break
          case 'rating':
            hotel.average_rating = parseFloat(value) || 0
            break
          case 'reviews':
            hotel.review_count = parseInt(value) || 0
            break
          default:
            hotel[header] = value
        }
      })

      hotels.push(hotel)
    }

    return hotels
  }

  const handleExportHotels = async () => {
    try {
      const exportHotels = httpsCallable(functions, 'exportHotels')
      const result = await exportHotels({
        format: 'csv',
        filters: {}
      })

      if (result.data.success) {
        // Create and download CSV file
        const blob = new Blob([result.data.data], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `hotels_export_${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      }
    } catch (error: any) {
      console.error('Export failed:', error)
      alert('Export failed: ' + error.message)
    }
  }

  const amenitiesList = [
    'Free WiFi', 'Swimming Pool', 'Fitness Center', 'Restaurant',
    'Room Service', '24/7 Front Desk', 'Airport Shuttle', 'Spa',
    'Parking', 'Business Center', 'Laundry Service', 'Concierge'
  ]

  return (
    <>
      <Helmet>
        <title>Hotel Admin Panel - Recharge Travels</title>
        <meta name="description" content="Manage hotels in the Recharge Travels booking system." />
      </Helmet>

      <Header />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Hotel Admin Panel</h1>
              <p className="text-gray-600 mt-2">Manage your hotel inventory and bookings</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowBulkImport(true)} className="flex items-center">
                <UploadCloud className="h-4 w-4 mr-2" />
                Bulk Import
              </Button>
              <Button variant="outline" onClick={handleExportHotels} className="flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add New Hotel
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Building className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Hotels</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalHotels}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Hotels</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeHotels}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Star className="h-8 w-8 text-yellow-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search hotels by name or city..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Hotels</SelectItem>
                    <SelectItem value="active">Active Only</SelectItem>
                    <SelectItem value="inactive">Inactive Only</SelectItem>
                  </SelectContent>
                </Select>

                {selectedHotels.length > 0 && (
                  <Button variant="destructive" onClick={handleBulkDelete}>
                    Delete Selected ({selectedHotels.length})
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Hotels Table */}
          <Card>
            <CardHeader>
              <CardTitle>Hotels ({filteredHotels.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedHotels.length === filteredHotels.length && filteredHotels.length > 0}
                        onCheckedChange={(checked) => {
                          setSelectedHotels(checked ? filteredHotels.map(h => h.id) : [])
                        }}
                      />
                    </TableHead>
                    <TableHead>Hotel</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHotels.map((hotel) => (
                    <TableRow key={hotel.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedHotels.includes(hotel.id)}
                          onCheckedChange={(checked) => {
                            setSelectedHotels(prev =>
                              checked
                                ? [...prev, hotel.id]
                                : prev.filter(id => id !== hotel.id)
                            )
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <img
                            src={hotel.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=50&h=50&fit=crop'}
                            alt={hotel.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div>
                            <div className="font-medium">{hotel.name}</div>
                            <div className="text-sm text-gray-500">{hotel.star_rating} stars</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm">{hotel.city?.name || hotel.address}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span>{hotel.average_rating?.toFixed(1) || 'N/A'}</span>
                          <span className="text-gray-500 ml-1">({hotel.review_count || 0})</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">${hotel.base_price_per_night || 'N/A'}</div>
                        <div className="text-sm text-gray-500">per night</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={hotel.is_active ? 'default' : 'secondary'}>
                          {hotel.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditHotel(hotel)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleHotelStatus(hotel)}
                          >
                            {hotel.is_active ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteHotel(hotel.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredHotels.length === 0 && (
                <div className="text-center py-12">
                  <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hotels found</h3>
                  <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add/Edit Hotel Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingHotel ? 'Edit Hotel' : 'Add New Hotel'}</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="amenities">Amenities</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Hotel Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="star_rating">Star Rating</Label>
                  <Select
                    value={formData.star_rating?.toString()}
                    onValueChange={(value) => handleInputChange('star_rating', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map(num => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} Star{num !== 1 ? 's' : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="hotel_type">Property Type</Label>
                  <Select
                    value={formData.hotel_type}
                    onValueChange={(value) => handleInputChange('hotel_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="luxury_resort">Luxury Resort</SelectItem>
                      <SelectItem value="boutique">Boutique Hotel</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="vacation_home">Vacation Home</SelectItem>
                      <SelectItem value="guesthouse">Guesthouse</SelectItem>
                      <SelectItem value="cabana">Cabana</SelectItem>
                      <SelectItem value="eco_lodge">Eco Lodge</SelectItem>
                      <SelectItem value="budget">Budget Hotel</SelectItem>
                      <SelectItem value="business">Business Hotel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="base_price">Base Price per Night ($)</Label>
                  <Input
                    id="base_price"
                    type="number"
                    value={formData.base_price_per_night}
                    onChange={(e) => handleInputChange('base_price_per_night', parseFloat(e.target.value))}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                />
                <Label htmlFor="is_active">Hotel is active and available for booking</Label>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="average_rating">Average Rating</Label>
                  <Input
                    id="average_rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.average_rating}
                    onChange={(e) => handleInputChange('average_rating', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="review_count">Review Count</Label>
                  <Input
                    id="review_count"
                    type="number"
                    value={formData.review_count}
                    onChange={(e) => handleInputChange('review_count', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="amenities" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {amenitiesList.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity}
                      checked={formData.amenities?.includes(amenity)}
                      onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                    />
                    <Label htmlFor={amenity}>{amenity}</Label>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="images" className="space-y-4">
              <div>
                <Label htmlFor="image_upload">Upload Images</Label>
                <Input
                  id="image_upload"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                />
              </div>

              {formData.images && formData.images.length > 0 && (
                <div className="grid grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image.image_url}
                        alt={image.caption || 'Hotel image'}
                        className="w-full h-24 object-cover rounded"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            images: prev.images?.filter((_, i) => i !== index)
                          }))
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveHotel}>
              <Save className="h-4 w-4 mr-2" />
              {editingHotel ? 'Update Hotel' : 'Save Hotel'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Import Dialog */}
      <Dialog open={showBulkImport} onOpenChange={setShowBulkImport}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <UploadCloud className="h-5 w-5 mr-2" />
              Bulk Import Hotels
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Format Selection */}
            <div>
              <Label className="text-base font-medium">Import Format</Label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="json"
                    checked={importFormat === 'json'}
                    onChange={(e) => setImportFormat(e.target.value as 'json')}
                    className="mr-2"
                  />
                  JSON Array
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="csv"
                    checked={importFormat === 'csv'}
                    onChange={(e) => setImportFormat(e.target.value as 'csv')}
                    className="mr-2"
                  />
                  CSV File
                </label>
              </div>
            </div>

            {/* Data Input */}
            <div>
              <Label htmlFor="import-data" className="text-base font-medium">
                {importFormat === 'json' ? 'JSON Data' : 'CSV Data'}
              </Label>
              <Textarea
                id="import-data"
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder={
                  importFormat === 'json'
                    ? '[{"name": "Hotel Name", "description": "...", "address": "...", "star_rating": 5, "base_price_per_night": 100}, ...]'
                    : 'name,description,address,star_rating,base_price_per_night,city,amenities\nHotel Name,Description,Address,5,100,Colombo,"Free WiFi;Swimming Pool"'
                }
                rows={12}
                className="mt-2 font-mono text-sm"
              />
            </div>

            {/* Import Progress */}
            {isImporting && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Importing hotels...</span>
                  <span>{importProgress}%</span>
                </div>
                <Progress value={importProgress} className="w-full" />
              </div>
            )}

            {/* Import Results */}
            {importResults && (
              <Alert className={importResults.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                <div className="flex items-start">
                  {importResults.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  )}
                  <div className="ml-3">
                    <AlertDescription>
                      <div className="font-medium mb-2">
                        {importResults.success ? 'Import Successful' : 'Import Failed'}
                      </div>
                      {importResults.success ? (
                        <div className="space-y-1 text-sm">
                          <div>✅ Imported: {importResults.results.success}</div>
                          <div>❌ Failed: {importResults.results.failed}</div>
                          {importResults.results.errors.length > 0 && (
                            <div className="mt-2">
                              <div className="font-medium">Errors:</div>
                              <ul className="list-disc list-inside text-xs mt-1">
                                {importResults.results.errors.slice(0, 5).map((error: string, index: number) => (
                                  <li key={index}>{error}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-sm">
                          {importResults.error}
                        </div>
                      )}
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
            )}

            {/* Help Text */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Import Guidelines</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>JSON Format:</strong> Array of hotel objects with standard fields</p>
                <p><strong>CSV Format:</strong> First row as headers, subsequent rows as data</p>
                <p><strong>Required fields:</strong> name, description</p>
                <p><strong>Optional fields:</strong> address, star_rating, base_price_per_night, city, amenities (semicolon-separated)</p>
                <p><strong>Note:</strong> Existing hotels with same name/address will be skipped unless overwrite is enabled</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setShowBulkImport(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleBulkImport}
              disabled={isImporting || !importData.trim()}
              className="bg-green-600 hover:bg-green-700"
            >
              {isImporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Importing...
                </>
              ) : (
                <>
                  <UploadCloud className="h-4 w-4 mr-2" />
                  Import Hotels
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  )
}

export default HotelAdminPanel