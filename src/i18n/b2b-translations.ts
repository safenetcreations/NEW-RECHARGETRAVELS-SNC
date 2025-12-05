// B2B Multi-Language Support & Geo-Detection
// Comprehensive translations for global travel agencies

export type B2BLanguage =
    | 'en' | 'ta' | 'si'  // Sri Lanka
    | 'de' | 'fr' | 'es'  // Europe
    | 'zh' | 'ja' | 'ko'  // East Asia
    | 'ar' | 'ru' | 'hi'  // Other major markets
    | 'pt' | 'it' | 'nl'; // Additional

export interface B2BTranslations {
    hero: {
        badge: string;
        title: string;
        titleHighlight: string;
        subtitle: string;
        cta: string;
        login: string;
        stats: {
            agencies: string;
            countries: string;
            tours: string;
            support: string;
        };
    };
    features: {
        title: string;
        subtitle: string;
        discount: { title: string; description: string };
        availability: { title: string; description: string };
        currency: { title: string; description: string };
        security: { title: string; description: string };
        support: { title: string; description: string };
        management: { title: string; description: string };
    };
    benefits: {
        title: string;
        subtitle: string;
        items: string[];
        quickStart: {
            title: string;
            steps: Array<{ title: string; description: string }>;
        };
    };
    testimonials: {
        title: string;
        subtitle: string;
    };
    cta: {
        title: string;
        subtitle: string;
        button: string;
    };
    registration: {
        title: string;
        subtitle: string;
        fields: {
            agencyName: string;
            email: string;
            password: string;
            confirmPassword: string;
            phone: string;
            country: string;
            website: string;
            companySize: string;
            tradeLicense: string;
        };
        submit: string;
        haveAccount: string;
        login: string;
    };
    dashboard: {
        welcome: string;
        totalBookings: string;
        revenue: string;
        commission: string;
        pendingBookings: string;
        quickBook: string;
        viewAll: string;
        recentBookings: string;
        newBooking: string;
    };
    common: {
        loading: string;
        error: string;
        success: string;
        cancel: string;
        save: string;
        learnMore: string;
        contactUs: string;
        whatsapp: string;
    };
}

// Country to Language mapping for geo-detection
export const countryLanguageMap: Record<string, B2BLanguage> = {
    // Sri Lanka
    'LK': 'en',

    // Europe
    'GB': 'en', 'US': 'en', 'AU': 'en', 'CA': 'en', 'NZ': 'en', 'IE': 'en',
    'DE': 'de', 'AT': 'de', 'CH': 'de',
    'FR': 'fr', 'BE': 'fr', 'LU': 'fr', 'MC': 'fr',
    'ES': 'es', 'MX': 'es', 'AR': 'es', 'CO': 'es', 'CL': 'es', 'PE': 'es',
    'PT': 'pt', 'BR': 'pt',
    'IT': 'it',
    'NL': 'nl',
    'RU': 'ru', 'BY': 'ru', 'KZ': 'ru',

    // Asia
    'CN': 'zh', 'TW': 'zh', 'HK': 'zh', 'SG': 'zh',
    'JP': 'ja',
    'KR': 'ko',
    'IN': 'hi',

    // Middle East
    'AE': 'ar', 'SA': 'ar', 'QA': 'ar', 'KW': 'ar', 'OM': 'ar', 'BH': 'ar', 'EG': 'ar', 'JO': 'ar',
};

// Full translations for each language
export const b2bTranslations: Record<B2BLanguage, B2BTranslations> = {
    en: {
        hero: {
            badge: 'B2B Travel Partner Portal',
            title: "Partner With Sri Lanka's",
            titleHighlight: 'Premier DMC',
            subtitle: 'Join 500+ travel agencies from 45+ countries. Book curated Sri Lanka tours with exclusive 15% commission, real-time availability, and instant WhatsApp confirmations.',
            cta: 'Register Your Agency',
            login: 'Agency Login',
            stats: {
                agencies: 'Partner Agencies',
                countries: 'Countries',
                tours: 'Tour Packages',
                support: '24/7 Support'
            }
        },
        features: {
            title: 'Why Partner With Us?',
            subtitle: 'Everything you need to offer exceptional Sri Lanka experiences to your clients',
            discount: {
                title: '15% Commission',
                description: 'Earn 15% commission on every booking. More bookings = higher tier = more earnings!'
            },
            availability: {
                title: 'Real-Time Availability',
                description: 'Instant access to tour availability with live seat counts and booking confirmations'
            },
            currency: {
                title: 'Multi-Currency',
                description: 'Pay in USD, EUR, GBP, or your local currency with transparent FX rates'
            },
            security: {
                title: 'Secure Platform',
                description: 'Enterprise-grade security with SSL encryption and PCI compliance'
            },
            support: {
                title: '24/7 Dedicated Support',
                description: 'Priority WhatsApp & email support with dedicated account managers'
            },
            management: {
                title: 'Client Management',
                description: 'Manage bookings, documents, invoices, and client data in one dashboard'
            }
        },
        benefits: {
            title: 'Exclusive Partner Benefits',
            subtitle: 'As a registered B2B partner, you\'ll enjoy preferential rates and dedicated support',
            items: [
                'Access to 100+ curated Sri Lanka tour packages',
                'Instant booking confirmations via WhatsApp & email',
                'Commission-based pricing with tiered rewards',
                'Dedicated account manager for all partners',
                'Priority support during peak seasons',
                'Custom itinerary and private tour requests',
                'White-label booking vouchers with your logo',
                'Quarterly commission statements and analytics'
            ],
            quickStart: {
                title: 'Quick Start Guide',
                steps: [
                    { title: 'Register Your Agency', description: 'Complete our simple 2-minute registration form' },
                    { title: 'Verify Your Account', description: 'Click the verification link sent to your email' },
                    { title: 'Get Approved (24hrs)', description: 'Our team reviews and activates your account fast' },
                    { title: 'Start Earning', description: 'Access exclusive tours with 15% commission!' }
                ]
            }
        },
        testimonials: {
            title: 'Trusted by 500+ Agencies Worldwide',
            subtitle: 'See what our partners say about working with us'
        },
        cta: {
            title: 'Ready to Grow Your Sri Lanka Business?',
            subtitle: 'Join our global network of travel agencies and start earning 15% commission today.',
            button: 'Get Started Free'
        },
        registration: {
            title: 'Register Your Agency',
            subtitle: 'Join our global B2B network in just 2 minutes',
            fields: {
                agencyName: 'Agency/Company Name',
                email: 'Business Email',
                password: 'Password',
                confirmPassword: 'Confirm Password',
                phone: 'Phone Number (with country code)',
                country: 'Country',
                website: 'Website (optional)',
                companySize: 'Company Size',
                tradeLicense: 'Trade License Number (optional)'
            },
            submit: 'Create Partner Account',
            haveAccount: 'Already have an account?',
            login: 'Login here'
        },
        dashboard: {
            welcome: 'Welcome back',
            totalBookings: 'Total Bookings',
            revenue: 'Total Revenue',
            commission: 'Commission Earned',
            pendingBookings: 'Pending Bookings',
            quickBook: 'Quick Book',
            viewAll: 'View All',
            recentBookings: 'Recent Bookings',
            newBooking: 'New Booking'
        },
        common: {
            loading: 'Loading...',
            error: 'Something went wrong',
            success: 'Success!',
            cancel: 'Cancel',
            save: 'Save',
            learnMore: 'Learn More',
            contactUs: 'Contact Us',
            whatsapp: 'Chat on WhatsApp'
        }
    },

    de: {
        hero: {
            badge: 'B2B Reisepartner-Portal',
            title: 'Partnerschaft mit Sri Lankas',
            titleHighlight: 'Führendem DMC',
            subtitle: 'Treten Sie 500+ Reisebüros aus über 45 Ländern bei. Buchen Sie kuratierte Sri Lanka-Touren mit exklusiver 15% Provision und WhatsApp-Bestätigungen.',
            cta: 'Agentur registrieren',
            login: 'Agentur-Login',
            stats: {
                agencies: 'Partner-Agenturen',
                countries: 'Länder',
                tours: 'Tourpakete',
                support: '24/7 Support'
            }
        },
        features: {
            title: 'Warum mit uns partnern?',
            subtitle: 'Alles, was Sie brauchen, um Ihren Kunden außergewöhnliche Sri Lanka-Erlebnisse zu bieten',
            discount: {
                title: '15% Provision',
                description: 'Verdienen Sie 15% Provision bei jeder Buchung. Mehr Buchungen = höhere Stufe!'
            },
            availability: {
                title: 'Echtzeit-Verfügbarkeit',
                description: 'Sofortiger Zugriff auf Tour-Verfügbarkeit mit Live-Buchungsbestätigungen'
            },
            currency: {
                title: 'Multi-Währung',
                description: 'Zahlen Sie in EUR, USD oder Ihrer Landeswährung mit transparenten Kursen'
            },
            security: {
                title: 'Sichere Plattform',
                description: 'Enterprise-Sicherheit mit SSL-Verschlüsselung und PCI-Compliance'
            },
            support: {
                title: '24/7 Dedizierter Support',
                description: 'Prioritäts-WhatsApp & E-Mail-Support mit persönlichem Ansprechpartner'
            },
            management: {
                title: 'Kundenmanagement',
                description: 'Verwalten Sie Buchungen, Dokumente und Rechnungen in einem Dashboard'
            }
        },
        benefits: {
            title: 'Exklusive Partner-Vorteile',
            subtitle: 'Als registrierter B2B-Partner genießen Sie Vorzugspreise und dedizierten Support',
            items: [
                'Zugang zu über 100 kuratierten Sri Lanka-Tourpaketen',
                'Sofortige Buchungsbestätigungen via WhatsApp & E-Mail',
                'Provisionsbasierte Preisgestaltung mit Stufenbelohnungen',
                'Dedizierter Kundenbetreuer für alle Partner',
                'Prioritätssupport während der Hochsaison',
                'Individuelle Reiserouten und private Touren',
                'White-Label-Buchungsgutscheine mit Ihrem Logo',
                'Vierteljährliche Provisionsabrechnungen und Analysen'
            ],
            quickStart: {
                title: 'Schnellstart-Anleitung',
                steps: [
                    { title: 'Agentur registrieren', description: 'Füllen Sie unser einfaches 2-Minuten-Formular aus' },
                    { title: 'Konto verifizieren', description: 'Klicken Sie auf den Link in Ihrer E-Mail' },
                    { title: 'Genehmigung (24 Std.)', description: 'Unser Team aktiviert Ihr Konto schnell' },
                    { title: 'Verdienen starten', description: 'Zugang zu exklusiven Touren mit 15% Provision!' }
                ]
            }
        },
        testimonials: {
            title: 'Vertraut von 500+ Agenturen weltweit',
            subtitle: 'Sehen Sie, was unsere Partner über die Zusammenarbeit sagen'
        },
        cta: {
            title: 'Bereit, Ihr Sri Lanka-Geschäft auszubauen?',
            subtitle: 'Treten Sie unserem globalen Netzwerk bei und verdienen Sie ab heute 15% Provision.',
            button: 'Kostenlos starten'
        },
        registration: {
            title: 'Agentur registrieren',
            subtitle: 'Treten Sie unserem globalen B2B-Netzwerk in nur 2 Minuten bei',
            fields: {
                agencyName: 'Agenturname/Firmenname',
                email: 'Geschäfts-E-Mail',
                password: 'Passwort',
                confirmPassword: 'Passwort bestätigen',
                phone: 'Telefonnummer (mit Ländervorwahl)',
                country: 'Land',
                website: 'Website (optional)',
                companySize: 'Unternehmensgröße',
                tradeLicense: 'Handelslizenznummer (optional)'
            },
            submit: 'Partner-Konto erstellen',
            haveAccount: 'Haben Sie bereits ein Konto?',
            login: 'Hier einloggen'
        },
        dashboard: {
            welcome: 'Willkommen zurück',
            totalBookings: 'Gesamtbuchungen',
            revenue: 'Gesamtumsatz',
            commission: 'Verdiente Provision',
            pendingBookings: 'Ausstehende Buchungen',
            quickBook: 'Schnellbuchung',
            viewAll: 'Alle anzeigen',
            recentBookings: 'Letzte Buchungen',
            newBooking: 'Neue Buchung'
        },
        common: {
            loading: 'Laden...',
            error: 'Etwas ist schief gelaufen',
            success: 'Erfolg!',
            cancel: 'Abbrechen',
            save: 'Speichern',
            learnMore: 'Mehr erfahren',
            contactUs: 'Kontakt',
            whatsapp: 'WhatsApp Chat'
        }
    },

    fr: {
        hero: {
            badge: 'Portail Partenaire B2B',
            title: 'Partenariat avec le',
            titleHighlight: 'Premier DMC du Sri Lanka',
            subtitle: 'Rejoignez plus de 500 agences de voyage de 45+ pays. Réservez des circuits Sri Lanka avec 15% de commission et confirmations WhatsApp.',
            cta: 'Inscrire votre agence',
            login: 'Connexion Agence',
            stats: {
                agencies: 'Agences Partenaires',
                countries: 'Pays',
                tours: 'Forfaits',
                support: 'Support 24/7'
            }
        },
        features: {
            title: 'Pourquoi nous choisir?',
            subtitle: 'Tout ce dont vous avez besoin pour offrir des expériences Sri Lanka exceptionnelles',
            discount: {
                title: '15% de Commission',
                description: 'Gagnez 15% sur chaque réservation. Plus de réservations = niveau supérieur!'
            },
            availability: {
                title: 'Disponibilité en Temps Réel',
                description: 'Accès instantané aux disponibilités avec confirmations en direct'
            },
            currency: {
                title: 'Multi-Devises',
                description: 'Payez en EUR, USD ou votre devise locale avec taux transparents'
            },
            security: {
                title: 'Plateforme Sécurisée',
                description: 'Sécurité entreprise avec cryptage SSL et conformité PCI'
            },
            support: {
                title: 'Support Dédié 24/7',
                description: 'Support prioritaire WhatsApp & email avec gestionnaire de compte dédié'
            },
            management: {
                title: 'Gestion Clients',
                description: 'Gérez réservations, documents et factures dans un seul tableau de bord'
            }
        },
        benefits: {
            title: 'Avantages Partenaires Exclusifs',
            subtitle: 'En tant que partenaire B2B, profitez de tarifs préférentiels et support dédié',
            items: [
                'Accès à plus de 100 circuits Sri Lanka sélectionnés',
                'Confirmations instantanées via WhatsApp & email',
                'Tarification basée sur commission avec récompenses',
                'Gestionnaire de compte dédié pour tous les partenaires',
                'Support prioritaire pendant les hautes saisons',
                'Demandes d\'itinéraires personnalisés acceptées',
                'Vouchers en marque blanche avec votre logo',
                'Relevés de commission trimestriels et analyses'
            ],
            quickStart: {
                title: 'Guide de Démarrage Rapide',
                steps: [
                    { title: 'Inscrivez votre agence', description: 'Remplissez notre formulaire simple de 2 minutes' },
                    { title: 'Vérifiez votre compte', description: 'Cliquez sur le lien envoyé par email' },
                    { title: 'Approbation (24h)', description: 'Notre équipe active votre compte rapidement' },
                    { title: 'Commencez à gagner', description: 'Accédez aux circuits exclusifs avec 15% de commission!' }
                ]
            }
        },
        testimonials: {
            title: 'Approuvé par 500+ Agences dans le Monde',
            subtitle: 'Voyez ce que nos partenaires disent de nous'
        },
        cta: {
            title: 'Prêt à développer votre activité Sri Lanka?',
            subtitle: 'Rejoignez notre réseau mondial et commencez à gagner 15% de commission.',
            button: 'Commencer gratuitement'
        },
        registration: {
            title: 'Inscrire votre agence',
            subtitle: 'Rejoignez notre réseau B2B mondial en 2 minutes',
            fields: {
                agencyName: 'Nom de l\'agence/Société',
                email: 'Email professionnel',
                password: 'Mot de passe',
                confirmPassword: 'Confirmer le mot de passe',
                phone: 'Numéro de téléphone (avec indicatif)',
                country: 'Pays',
                website: 'Site web (optionnel)',
                companySize: 'Taille de l\'entreprise',
                tradeLicense: 'Numéro de licence commerciale (optionnel)'
            },
            submit: 'Créer un compte partenaire',
            haveAccount: 'Vous avez déjà un compte?',
            login: 'Se connecter ici'
        },
        dashboard: {
            welcome: 'Bienvenue',
            totalBookings: 'Réservations Totales',
            revenue: 'Chiffre d\'Affaires',
            commission: 'Commission Gagnée',
            pendingBookings: 'Réservations en Attente',
            quickBook: 'Réservation Rapide',
            viewAll: 'Voir Tout',
            recentBookings: 'Réservations Récentes',
            newBooking: 'Nouvelle Réservation'
        },
        common: {
            loading: 'Chargement...',
            error: 'Une erreur s\'est produite',
            success: 'Succès!',
            cancel: 'Annuler',
            save: 'Enregistrer',
            learnMore: 'En savoir plus',
            contactUs: 'Nous contacter',
            whatsapp: 'Chat WhatsApp'
        }
    },

    es: {
        hero: {
            badge: 'Portal de Socios B2B',
            title: 'Asóciese con el',
            titleHighlight: 'Principal DMC de Sri Lanka',
            subtitle: 'Únase a más de 500 agencias de viajes de 45+ países. Reserve tours de Sri Lanka con 15% de comisión y confirmaciones por WhatsApp.',
            cta: 'Registrar su Agencia',
            login: 'Acceso Agencias',
            stats: {
                agencies: 'Agencias Asociadas',
                countries: 'Países',
                tours: 'Paquetes de Tours',
                support: 'Soporte 24/7'
            }
        },
        features: {
            title: '¿Por qué asociarse con nosotros?',
            subtitle: 'Todo lo que necesita para ofrecer experiencias excepcionales de Sri Lanka',
            discount: {
                title: '15% de Comisión',
                description: 'Gane 15% en cada reserva. ¡Más reservas = nivel superior = más ganancias!'
            },
            availability: {
                title: 'Disponibilidad en Tiempo Real',
                description: 'Acceso instantáneo a disponibilidad con confirmaciones en vivo'
            },
            currency: {
                title: 'Multi-Moneda',
                description: 'Pague en EUR, USD o su moneda local con tasas transparentes'
            },
            security: {
                title: 'Plataforma Segura',
                description: 'Seguridad empresarial con cifrado SSL y cumplimiento PCI'
            },
            support: {
                title: 'Soporte Dedicado 24/7',
                description: 'Soporte prioritario por WhatsApp y email con gestor de cuenta dedicado'
            },
            management: {
                title: 'Gestión de Clientes',
                description: 'Gestione reservas, documentos y facturas en un solo panel'
            }
        },
        benefits: {
            title: 'Beneficios Exclusivos para Socios',
            subtitle: 'Como socio B2B registrado, disfrutará de tarifas preferenciales y soporte dedicado',
            items: [
                'Acceso a más de 100 paquetes de tours seleccionados',
                'Confirmaciones instantáneas por WhatsApp y email',
                'Precios basados en comisión con recompensas por niveles',
                'Gestor de cuenta dedicado para todos los socios',
                'Soporte prioritario durante temporadas altas',
                'Solicitudes de itinerarios personalizados aceptadas',
                'Vouchers con marca blanca con su logo',
                'Estados de comisión trimestrales y análisis'
            ],
            quickStart: {
                title: 'Guía de Inicio Rápido',
                steps: [
                    { title: 'Registre su Agencia', description: 'Complete nuestro formulario simple de 2 minutos' },
                    { title: 'Verifique su Cuenta', description: 'Haga clic en el enlace enviado a su email' },
                    { title: 'Aprobación (24 horas)', description: 'Nuestro equipo activa su cuenta rápidamente' },
                    { title: 'Empiece a Ganar', description: '¡Acceso a tours exclusivos con 15% de comisión!' }
                ]
            }
        },
        testimonials: {
            title: 'Confianza de 500+ Agencias en Todo el Mundo',
            subtitle: 'Vea lo que dicen nuestros socios sobre trabajar con nosotros'
        },
        cta: {
            title: '¿Listo para hacer crecer su negocio en Sri Lanka?',
            subtitle: 'Únase a nuestra red global y comience a ganar 15% de comisión hoy.',
            button: 'Empezar Gratis'
        },
        registration: {
            title: 'Registrar su Agencia',
            subtitle: 'Únase a nuestra red B2B global en solo 2 minutos',
            fields: {
                agencyName: 'Nombre de Agencia/Empresa',
                email: 'Email Empresarial',
                password: 'Contraseña',
                confirmPassword: 'Confirmar Contraseña',
                phone: 'Número de Teléfono (con código de país)',
                country: 'País',
                website: 'Sitio Web (opcional)',
                companySize: 'Tamaño de la Empresa',
                tradeLicense: 'Número de Licencia Comercial (opcional)'
            },
            submit: 'Crear Cuenta de Socio',
            haveAccount: '¿Ya tiene una cuenta?',
            login: 'Iniciar sesión aquí'
        },
        dashboard: {
            welcome: 'Bienvenido de nuevo',
            totalBookings: 'Reservas Totales',
            revenue: 'Ingresos Totales',
            commission: 'Comisión Ganada',
            pendingBookings: 'Reservas Pendientes',
            quickBook: 'Reserva Rápida',
            viewAll: 'Ver Todo',
            recentBookings: 'Reservas Recientes',
            newBooking: 'Nueva Reserva'
        },
        common: {
            loading: 'Cargando...',
            error: 'Algo salió mal',
            success: '¡Éxito!',
            cancel: 'Cancelar',
            save: 'Guardar',
            learnMore: 'Más Información',
            contactUs: 'Contáctenos',
            whatsapp: 'Chat de WhatsApp'
        }
    },

    // Add simplified versions for other languages
    ta: {
        hero: {
            badge: 'B2B பயண பங்குதாரர் போர்டல்',
            title: 'இலங்கையின்',
            titleHighlight: 'முதன்மை DMC உடன் கூட்டணி',
            subtitle: '45+ நாடுகளில் இருந்து 500+ பயண நிறுவனங்களுடன் இணையுங்கள். 15% கமிஷன் மற்றும் WhatsApp உறுதிப்படுத்தல்கள்.',
            cta: 'உங்கள் நிறுவனத்தை பதிவு செய்யுங்கள்',
            login: 'நிறுவன உள்நுழைவு',
            stats: { agencies: 'பங்குதாரர் நிறுவனங்கள்', countries: 'நாடுகள்', tours: 'சுற்றுலா தொகுப்புகள்', support: '24/7 ஆதரவு' }
        },
        features: {
            title: 'ஏன் எங்களுடன் கூட்டணி?',
            subtitle: 'உங்கள் வாடிக்கையாளர்களுக்கு சிறந்த இலங்கை அனுபவங்களை வழங்க தேவையான அனைத்தும்',
            discount: { title: '15% கமிஷன்', description: 'ஒவ்வொரு முன்பதிவிலும் 15% கமிஷன் பெறுங்கள்!' },
            availability: { title: 'நிகழ்நேர கிடைக்கும் தன்மை', description: 'உடனடி முன்பதிவு உறுதிப்படுத்தல்கள்' },
            currency: { title: 'பல நாணயம்', description: 'USD, EUR அல்லது உங்கள் உள்ளூர் நாணயத்தில் செலுத்துங்கள்' },
            security: { title: 'பாதுகாப்பான தளம்', description: 'SSL குறியாக்கம் மற்றும் PCI இணக்கம்' },
            support: { title: '24/7 ஆதரவு', description: 'முன்னுரிமை WhatsApp & மின்னஞ்சல் ஆதரவு' },
            management: { title: 'வாடிக்கையாளர் மேலாண்மை', description: 'முன்பதிவுகள் மற்றும் விலைப்பட்டியல்களை நிர்வகிக்கவும்' }
        },
        benefits: {
            title: 'தனிப்பட்ட பங்குதாரர் நன்மைகள்',
            subtitle: 'பதிவுசெய்யப்பட்ட B2B பங்குதாரராக, முன்னுரிமை விகிதங்களை அனுபவிக்கவும்',
            items: ['100+ இலங்கை சுற்றுலா தொகுப்புகள்', 'WhatsApp மூலம் உடனடி உறுதிப்படுத்தல்கள்', 'கமிஷன் அடிப்படையிலான விலை', 'அர்ப்பணிக்கப்பட்ட கணக்கு மேலாளர்', 'பருவ நேர ஆதரவு', 'தனிப்பயன் பயண திட்டங்கள்', 'உங்கள் லோகோவுடன் வவுச்சர்கள்', 'காலாண்டு கமிஷன் அறிக்கைகள்'],
            quickStart: { title: 'விரைவு தொடக்க வழிகாட்டி', steps: [{ title: 'நிறுவனத்தை பதிவு செய்யுங்கள்', description: '2 நிமிட படிவத்தை நிரப்புங்கள்' }, { title: 'கணக்கை சரிபார்க்கவும்', description: 'மின்னஞ்சல் இணைப்பைக் கிளிக் செய்யுங்கள்' }, { title: 'ஒப்புதல் (24 மணி நேரம்)', description: 'எங்கள் குழு உங்கள் கணக்கை செயல்படுத்துகிறது' }, { title: 'சம்பாதிக்கத் தொடங்குங்கள்', description: '15% கமிஷனுடன் சுற்றுலாக்கள்!' }] }
        },
        testimonials: { title: 'உலகளவில் 500+ நிறுவனங்களால் நம்பப்படுகிறது', subtitle: 'எங்கள் பங்குதாரர்கள் என்ன சொல்கிறார்கள் என்பதைப் பாருங்கள்' },
        cta: { title: 'உங்கள் இலங்கை வணிகத்தை வளர்க்க தயாரா?', subtitle: 'எங்கள் உலகளாவிய நெட்வொர்க்கில் இணையுங்கள்.', button: 'இலவசமாக தொடங்குங்கள்' },
        registration: { title: 'உங்கள் நிறுவனத்தை பதிவு செய்யுங்கள்', subtitle: '2 நிமிடங்களில் எங்கள் B2B நெட்வொர்க்கில் இணையுங்கள்', fields: { agencyName: 'நிறுவனத்தின் பெயர்', email: 'வணிக மின்னஞ்சல்', password: 'கடவுச்சொல்', confirmPassword: 'கடவுச்சொல்லை உறுதிப்படுத்தவும்', phone: 'தொலைபேசி எண்', country: 'நாடு', website: 'இணையதளம்', companySize: 'நிறுவன அளவு', tradeLicense: 'வர்த்தக உரிம எண்' }, submit: 'பங்குதாரர் கணக்கை உருவாக்கு', haveAccount: 'ஏற்கனவே கணக்கு உள்ளதா?', login: 'இங்கே உள்நுழையவும்' },
        dashboard: { welcome: 'மீண்டும் வரவேற்கிறோம்', totalBookings: 'மொத்த முன்பதிவுகள்', revenue: 'மொத்த வருவாய்', commission: 'கமிஷன் சம்பாதித்தது', pendingBookings: 'நிலுவையில் உள்ள முன்பதிவுகள்', quickBook: 'விரைவு முன்பதிவு', viewAll: 'அனைத்தையும் காண்க', recentBookings: 'சமீபத்திய முன்பதிவுகள்', newBooking: 'புதிய முன்பதிவு' },
        common: { loading: 'ஏற்றுகிறது...', error: 'ஏதோ தவறு ஏற்பட்டது', success: 'வெற்றி!', cancel: 'ரத்து செய்', save: 'சேமி', learnMore: 'மேலும் அறிக', contactUs: 'தொடர்புகொள்ளவும்', whatsapp: 'WhatsApp அரட்டை' }
    },

    si: {
        hero: {
            badge: 'B2B සංචාරක හවුල්කාර පෝටලය',
            title: 'ශ්‍රී ලංකාවේ',
            titleHighlight: 'ප්‍රමුඛ DMC සමඟ හවුල්කරු වන්න',
            subtitle: 'රටවල් 45+ කින් සංචාරක නියෝජිතායතන 500+ හා එක්වන්න. 15% කොමිස් සහ WhatsApp තහවුරු කිරීම්.',
            cta: 'ඔබේ ආයතනය ලියාපදිංචි කරන්න',
            login: 'ආයතන පිවිසුම',
            stats: { agencies: 'හවුල්කාර ආයතන', countries: 'රටවල්', tours: 'සංචාර පැකේජ', support: 'පැය 24/7 සහාය' }
        },
        features: {
            title: 'අප සමඟ හවුල්කරු වන්නේ ඇයි?',
            subtitle: 'ඔබේ ගනුදෙනුකරුවන්ට විශිෂ්ට ශ්‍රී ලංකා අත්දැකීම් ලබා දීමට අවශ්‍ය සියල්ල',
            discount: { title: '15% කොමිස්', description: 'සෑම වෙන්කිරීමකදීම 15% කොමිස් උපයන්න!' },
            availability: { title: 'තත්‍ය කාලීන ලබා ගත හැකියාව', description: 'ක්ෂණික වෙන්කිරීම් තහවුරු කිරීම්' },
            currency: { title: 'බහු මුදල්', description: 'USD, EUR හෝ ඔබේ දේශීය මුදල්වලින් ගෙවන්න' },
            security: { title: 'ආරක්ෂිත වේදිකාව', description: 'SSL සංකේතනය සහ PCI අනුකූලතාව' },
            support: { title: 'පැය 24/7 සහාය', description: 'ප්‍රමුඛතා WhatsApp සහ email සහාය' },
            management: { title: 'පාරිභෝගික කළමනාකරණය', description: 'වෙන්කිරීම් සහ ඉන්වොයිස් කළමනාකරණය' }
        },
        benefits: {
            title: 'විශේෂ හවුල්කාර ප්‍රතිලාභ',
            subtitle: 'ලියාපදිංචි B2B හවුල්කරුවෙකු ලෙස, ප්‍රමුඛතා මිල ගණන් භුක්ති විඳින්න',
            items: ['ශ්‍රී ලංකා සංචාර පැකේජ 100+', 'WhatsApp හරහා ක්ෂණික තහවුරු කිරීම්', 'කොමිස් පදනම් මිල', 'කැපවූ ගිණුම් කළමනාකරු', 'සමය සහාය', 'අභිරුචි සංචාර සැලසුම්', 'ඔබේ ලාංඡනය සහිත වවුචර්', 'කාර්තුමය කොමිස් වාර්තා'],
            quickStart: { title: 'ඉක්මන් ආරම්භ මාර්ගෝපදේශය', steps: [{ title: 'ආයතනය ලියාපදිංචි කරන්න', description: 'විනාඩි 2 ක පෝරමය පුරවන්න' }, { title: 'ගිණුම සත්‍යාපනය කරන්න', description: 'email සබැඳිය ක්ලික් කරන්න' }, { title: 'අනුමැතිය (පැය 24)', description: 'අපගේ කණ්ඩායම ඔබේ ගිණුම සක්‍රිය කරයි' }, { title: 'උපයන්න ආරම්භ කරන්න', description: '15% කොමිස් සහිත සංචාර!' }] }
        },
        testimonials: { title: 'ලොව පුරා ආයතන 500+ ක් විශ්වාස කරයි', subtitle: 'අපගේ හවුල්කරුවන් කියන දේ බලන්න' },
        cta: { title: 'ඔබේ ශ්‍රී ලංකා ව්‍යාපාරය වර්ධනය කිරීමට සූදානම්ද?', subtitle: 'අපගේ ගෝලීය ජාලයට එක්වන්න.', button: 'නොමිලේ ආරම්භ කරන්න' },
        registration: { title: 'ඔබේ ආයතනය ලියාපදිංචි කරන්න', subtitle: 'විනාඩි 2 කින් අපගේ B2B ජාලයට එක්වන්න', fields: { agencyName: 'ආයතනයේ නම', email: 'ව්‍යාපාර email', password: 'මුරපදය', confirmPassword: 'මුරපදය තහවුරු කරන්න', phone: 'දුරකථන අංකය', country: 'රට', website: 'වෙබ් අඩවිය', companySize: 'සමාගම් ප්‍රමාණය', tradeLicense: 'වෙළඳ බලපත්‍ර අංකය' }, submit: 'හවුල්කාර ගිණුමක් සාදන්න', haveAccount: 'දැනටමත් ගිණුමක් තිබේද?', login: 'මෙහි පිවිසෙන්න' },
        dashboard: { welcome: 'නැවත සාදරයෙන් පිළිගනිමු', totalBookings: 'මුළු වෙන්කිරීම්', revenue: 'මුළු ආදායම', commission: 'උපයන ලද කොමිස්', pendingBookings: 'පොරොත්තු වෙන්කිරීම්', quickBook: 'ඉක්මන් වෙන්කිරීම', viewAll: 'සියල්ල බලන්න', recentBookings: 'මෑත වෙන්කිරීම්', newBooking: 'නව වෙන්කිරීම' },
        common: { loading: 'පූරණය වෙමින්...', error: 'යමක් වැරදී ඇත', success: 'සාර්ථකයි!', cancel: 'අවලංගු කරන්න', save: 'සුරකින්න', learnMore: 'තව දැනගන්න', contactUs: 'අප හා සම්බන්ධ වන්න', whatsapp: 'WhatsApp Chat' }
    },

    // Placeholder for remaining languages (using English as base)
    zh: { ...this?.en || {} } as B2BTranslations,
    ja: { ...this?.en || {} } as B2BTranslations,
    ko: { ...this?.en || {} } as B2BTranslations,
    ar: { ...this?.en || {} } as B2BTranslations,
    ru: { ...this?.en || {} } as B2BTranslations,
    hi: { ...this?.en || {} } as B2BTranslations,
    pt: { ...this?.en || {} } as B2BTranslations,
    it: { ...this?.en || {} } as B2BTranslations,
    nl: { ...this?.en || {} } as B2BTranslations,
};

// Initialize remaining translations with English as fallback
['zh', 'ja', 'ko', 'ar', 'ru', 'hi', 'pt', 'it', 'nl'].forEach(lang => {
    if (!b2bTranslations[lang as B2BLanguage] || Object.keys(b2bTranslations[lang as B2BLanguage]).length === 0) {
        b2bTranslations[lang as B2BLanguage] = { ...b2bTranslations.en };
    }
});

// Language display names
export const languageNames: Record<B2BLanguage, string> = {
    en: 'English',
    ta: 'தமிழ்',
    si: 'සිංහල',
    de: 'Deutsch',
    fr: 'Français',
    es: 'Español',
    zh: '中文',
    ja: '日本語',
    ko: '한국어',
    ar: 'العربية',
    ru: 'Русский',
    hi: 'हिन्दी',
    pt: 'Português',
    it: 'Italiano',
    nl: 'Nederlands'
};

// Flag emojis for language selector
export const languageFlags: Record<B2BLanguage, string> = {
    en: '🇬🇧',
    ta: '🇱🇰',
    si: '🇱🇰',
    de: '🇩🇪',
    fr: '🇫🇷',
    es: '🇪🇸',
    zh: '🇨🇳',
    ja: '🇯🇵',
    ko: '🇰🇷',
    ar: '🇸🇦',
    ru: '🇷🇺',
    hi: '🇮🇳',
    pt: '🇵🇹',
    it: '🇮🇹',
    nl: '🇳🇱'
};

export default b2bTranslations;
