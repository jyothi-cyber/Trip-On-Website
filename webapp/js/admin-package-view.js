/**
 * Admin Package View Page
 * Displays detailed package information
 */

// ============================================================================
// GLOBAL STATE
// ============================================================================

let currentPackage = null;
let currentTab = 'highlights';

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    loadPackageFromURL();
    initializeEventListeners();
});

function initializeEventListeners() {
    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleSidebar);
    }
    
    // Initialize mobile menu
    initializeMobileMenu();
    
    // Add window resize listener to handle responsive content
    window.addEventListener('resize', function() {
        if (currentPackage) {
            loadItineraryTab(currentPackage);
        }
    });
}

function initializeMobileMenu() {
    // Mobile menu button (in mobile header)
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebarOverlay');
            if (sidebar) {
                sidebar.classList.toggle('active');
            }
            if (overlay) {
                overlay.classList.toggle('active');
            }
        });
    }
    
    // Close sidebar when clicking overlay
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', function() {
            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
                sidebar.classList.remove('active');
            }
            this.classList.remove('active');
        });
    }
    
    // Mobile profile button
    const mobileProfileBtn = document.getElementById('mobileProfileBtn');
    if (mobileProfileBtn) {
        mobileProfileBtn.addEventListener('click', function() {
            if (confirm('Do you want to logout?')) {
                sessionStorage.removeItem('adminLoggedIn');
                sessionStorage.removeItem('adminEmail');
                window.location.href = 'admin-login.html';
            }
        });
    }
    
    // Close sidebar when clicking a nav link (mobile)
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                const sidebar = document.getElementById('sidebar');
                const overlay = document.getElementById('sidebarOverlay');
                if (sidebar) {
                    sidebar.classList.remove('active');
                }
                if (overlay) {
                    overlay.classList.remove('active');
                }
            }
        });
    });
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.toggle('collapsed');
    }
}

// ============================================================================
// LOAD PACKAGE DATA
// ============================================================================

function loadPackageFromURL() {
    // Get package ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const packageId = urlParams.get('id');
    
    if (packageId) {
        currentPackage = getPackageById(parseInt(packageId));
        if (currentPackage) {
            displayPackageDetails(currentPackage);
        } else {
            showError('Package not found');
        }
    } else {
        // If no ID, show first package as demo
        const packages = getAllPackages();
        if (packages.length > 0) {
            currentPackage = packages[0];
            displayPackageDetails(currentPackage);
        } else {
            showError('No packages available');
        }
    }
}

function displayPackageDetails(pkg) {
    // Update page title
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
        const categoryText = getCategoryText(pkg.category);
        pageTitle.textContent = `${categoryText} ${pkg.type.split(' ')[0]} | View Package`;
    }
    
    // Update date
    const viewDate = document.getElementById('viewDate');
    if (viewDate) {
        viewDate.textContent = formatDate(pkg.updatedDate || pkg.createdDate);
    }
    
    // Update hero image
    const heroImage = document.getElementById('packageHeroImage');
    if (heroImage) {
        heroImage.src = pkg.image;
        heroImage.alt = pkg.name;
        heroImage.onerror = function() {
            this.src = '../assets/images/hero.png';
        };
    }
    
    // Update title section
    document.getElementById('categoryBadge').textContent = pkg.category.replace('nights', 'N');
    document.getElementById('typeBadge').textContent = pkg.type.split(' ')[0];
    document.getElementById('packageMainTitle').textContent = pkg.name;
    document.getElementById('packageDescription').textContent = pkg.description;
    
    // Update price card
    const formattedPrice = formatCurrency(pkg.price);
    document.getElementById('priceAmount').textContent = formattedPrice;
    document.getElementById('durationText').textContent = pkg.duration;
    
    // Update website link
    const websiteBtn = document.getElementById('viewWebsiteBtn');
    if (websiteBtn && pkg.pageUrl) {
        websiteBtn.href = pkg.pageUrl;
    }
    
    // Load tab content
    loadHighlightsTab(pkg);
    loadItineraryTab(pkg);
    loadTripOverview(pkg);
    loadBudgetTab(pkg);
    loadHotelsTab(pkg);
}

// ============================================================================
// TAB CONTENT LOADERS
// ============================================================================

function loadHighlightsTab(pkg) {
    // Load activities with more comprehensive data
    const activitiesList = document.getElementById('activitiesList');
    if (activitiesList) {
        const activities = pkg.inclusions && pkg.inclusions.length > 0 ? pkg.inclusions : [
            'Airport transfers and transportation',
            'Professional tour guide service',
            'Sightseeing as per itinerary',
            'Photography assistance',
            'Cultural experience programs',
            '24/7 customer support'
        ];
        
        activitiesList.innerHTML = activities.slice(0, 6).map(activity => `
            <div class="activity-item">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fill="#0e5a36"/>
                </svg>
                <span>${activity}</span>
            </div>
        `).join('');
    }
    
    // Load package type details with comprehensive information
    const categoryElement = document.getElementById('pkgCategory');
    const stayingElement = document.getElementById('pkgStaying');
    const personElement = document.getElementById('pkgPerson');
    const otherElement = document.getElementById('pkgOther');
    const mealsElement = document.getElementById('pkgMeals');
    const hotelsElement = document.getElementById('pkgHotels');
    
    if (categoryElement) categoryElement.textContent = pkg.typeCategory || pkg.type || 'Standard Package';
    if (stayingElement) stayingElement.textContent = pkg.typeStaying || `${getDurationNights(pkg.duration)} nights accommodation`;
    if (personElement) personElement.textContent = pkg.typePerson || '2-4 Adults (Child policy available)';
    if (otherElement) otherElement.textContent = pkg.typeOther || 'Personal expenses not included';
    if (mealsElement) mealsElement.textContent = pkg.typeMeals || 'Daily breakfast + selected meals';
    if (hotelsElement) {
        hotelsElement.textContent = pkg.typeHotels || 
            `${pkg.type} category hotels with modern amenities including AC, WiFi, room service, and complimentary breakfast. Extra bed available on request.`;
    }
}

function getDurationNights(duration) {
    const nights = duration.match(/(\d+)\s*Nights?/i);
    return nights ? nights[1] : '3';
}

function loadItineraryTab(pkg) {
    console.log('Loading itinerary tab with extended descriptions for:', pkg.name);
    const itineraryList = document.getElementById('itineraryList');
    if (!itineraryList) return;
    
    // Check if we're on mobile device
    const isMobile = window.innerWidth <= 768;
    
    if (false && pkg.itinerary && pkg.itinerary.length > 0) {
        itineraryList.innerHTML = pkg.itinerary.map((day, index) => `
            <div class="itinerary-day" id="day-${index}">
                <div class="day-header" onclick="toggleDay(${index})">
                    <div class="day-info">
                        <div class="day-number">Day ${day.day}</div>
                    </div>
                    <svg class="day-toggle" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M6 8l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </div>
                <div class="day-content">
                    <div class="day-details">
                        <div class="day-description">
                            <p>${day.activities}</p>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    } else {
        console.log('Using extended descriptions instead of package itinerary data');
        
        // Function to get mobile or desktop content
        const getContent = (mobileText, desktopText) => {
            return isMobile ? mobileText : desktopText;
        };
        
        // Extended website-style detailed itinerary information
        itineraryList.innerHTML = `
            <div class="itinerary-day" id="day-0">
                <div class="day-header" onclick="toggleDay(0)">
                    <div class="day-info">
                        <div class="day-number">Day 1</div>
                    </div>
                    <svg class="day-toggle" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M6 8l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </div>
                <div class="day-content">
                    <div class="day-details">
                        <div class="day-description">
                            <p>${getContent(
                                `Arrive at ${pkg.location} International Airport where our representative will welcome you and assist with transfers to your ${pkg.type} accommodation. Complete hotel check-in and receive a welcome briefing with itinerary details and local recommendations. Evening at leisure to explore hotel grounds or nearby areas.`,
                                `Arrive at ${pkg.location} International Airport where our experienced representative will greet you at the arrival gate with a warm welcome, traditional flower garlands, and refreshing welcome drinks while assisting you through all immigration and customs procedures with personalized attention and care. Experience a luxurious private transfer in air-conditioned vehicles to your meticulously selected ${pkg.type} category accommodation, enjoying panoramic views of the stunning landscapes, local architecture, and vibrant street life that offers your first authentic glimpse into the rich cultural tapestry of this enchanting destination. Upon arrival at your hotel or resort, complete smooth check-in formalities while our concierge team provides you with a comprehensive welcome briefing including detailed daily itineraries, essential contact information, cultural etiquette tips, local currency exchange guidance, and personalized recommendations for nearby attractions, restaurants, and shopping areas. The remainder of your evening is completely at leisure - you may choose to take a peaceful sunset stroll around the beautifully landscaped hotel gardens, explore the immediate neighborhood's charming cafes and local markets to immerse yourself in daily life, indulge in the hotel's spa facilities for jet lag recovery, or simply unwind by the pool or in your comfortable room while savoring the anticipation of tomorrow's adventures. Rest peacefully tonight in your comfortable accommodation as tomorrow marks the beginning of an unforgettable journey filled with cultural discoveries, natural wonders, and life-changing experiences that will create memories to last a lifetime.`
                            )}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="itinerary-day" id="day-1">
                <div class="day-header" onclick="toggleDay(1)">
                    <div class="day-info">
                        <div class="day-number">Day 2</div>
                    </div>
                    <svg class="day-toggle" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M6 8l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </div>
                <div class="day-content">
                    <div class="day-details">
                        <div class="day-description">
                            <p>${getContent(
                                `Begin cultural exploration with breakfast featuring local cuisine. Meet your expert guide and visit magnificent temples, sacred sites, and architectural marvels. Explore vibrant local markets with spices, textiles, handicrafts, and street food. Visit art galleries, craft workshops, and museums showcasing local heritage.`,
                                `Begin your immersive cultural exploration after enjoying a lavish breakfast buffet featuring an exquisite blend of authentic local delicacies, fresh tropical fruits, artisanal breads, and international cuisine served in the elegant hotel restaurant with panoramic views of the surrounding landscapes. Meet your expert English-speaking guide who possesses extensive knowledge of local history, traditions, and hidden gems, and embark on a fascinating journey to the region's most magnificent temples, sacred sites, and architectural marvels, where you'll witness centuries-old religious ceremonies, learn about ancient spiritual practices, and marvel at intricate stone carvings and golden sculptures that tell stories of bygone eras. Explore vibrant local markets bustling with activity where friendly vendors offer exotic spices, handwoven textiles, traditional handicrafts, and tropical produce while you sample delicious street food specialties, interact with local families, and experience the authentic pulse of daily life in this remarkable destination. Continue your cultural immersion with visits to renowned art galleries showcasing contemporary and traditional works by celebrated local artists, traditional craft workshops where skilled artisans demonstrate age-old techniques in pottery, weaving, and wood carving, and fascinating museums that house precious artifacts, historical exhibits, and cultural treasures that provide deep insights into the rich heritage and evolution of this captivating region. Conclude your day with a traditional cultural performance featuring mesmerizing dances, enchanting music, and colorful costumes that celebrate the artistic legacy of the local community, followed by a sumptuous dinner at an authentic restaurant serving regional specialties prepared with family recipes passed down through generations.`
                            )}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="itinerary-day" id="day-2">
                <div class="day-header" onclick="toggleDay(2)">
                    <div class="day-info">
                        <div class="day-number">Day 3</div>
                    </div>
                    <svg class="day-toggle" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M6 8l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </div>
                <div class="day-content">
                    <div class="day-details">
                        <div class="day-description">
                            <p>${getContent(
                                `Embark on a full-day adventure showcasing ${pkg.location}'s natural beauty through scenic routes and traditional villages. Visit stunning attractions including waterfalls, rice terraces, and volcanic viewpoints. Engage in outdoor activities like trekking, water sports, or zip-lining. Enjoy gourmet picnic lunch at spectacular viewpoints.`,
                                `Embark on an exhilarating full-day adventure that showcases the breathtaking natural beauty, diverse ecosystems, and spectacular landscapes of ${pkg.location}, beginning with an early morning departure in comfortable air-conditioned vehicles that wind through scenic countryside roads, traditional villages with terraced fields, and lush tropical forests while your knowledgeable guide shares fascinating insights about local flora, fauna, and geographical formations. Journey to some of the most stunning natural attractions including cascading multi-tiered waterfalls where crystal-clear mountain spring water creates refreshing natural pools perfect for swimming, emerald-green rice terraces that create a mesmerizing stepped landscape stretching as far as the eye can see, dramatic volcanic viewpoints offering 360-degree panoramic vistas of valleys and mountain ranges, or pristine crater lakes with mirror-like surfaces reflecting the surrounding peaks. Engage in thrilling outdoor activities carefully selected based on your fitness level and adventure preferences, including guided jungle trekking through ancient rainforests home to exotic birds and wildlife, white-water rafting through exciting rapids and calm stretches of pristine rivers, zip-lining through forest canopies for an adrenaline rush and bird's-eye views, mountain biking along scenic trails, or peaceful bamboo rafting through tranquil waters surrounded by limestone cliffs and tropical vegetation. Savor a specially prepared gourmet picnic lunch at one of the most spectacular viewpoints, featuring fresh local ingredients, regional specialties, and refreshing beverages while you're surrounded by nature's magnificence and capture stunning photographs that will make your friends envious. Throughout this adventure-packed day, your experienced guide will ensure your safety with professional equipment and expertise while pointing out unique photo opportunities, sharing local legends and stories about each location, and providing insights into the conservation efforts that protect these pristine natural environments for future generations to enjoy.`
                            )}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="itinerary-day" id="day-3">
                <div class="day-header" onclick="toggleDay(3)">
                    <div class="day-info">
                        <div class="day-number">Day 4</div>
                    </div>
                    <svg class="day-toggle" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M6 8l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </div>
                <div class="day-content">
                    <div class="day-details">
                        <div class="day-description">
                            <p>${getContent(
                                `Discover ${pkg.location}'s pristine beaches with scenic coastal drives and dramatic cliffs. Spend time at breathtaking beaches with white sand, swimming, and snorkeling among coral reefs. Take boat excursions to hidden islands and sea caves. Enjoy fresh seafood on the beach and spectacular sunset views.`,
                                `Discover the pristine coastal paradise and crystalline azure waters that have made ${pkg.location} a world-renowned tropical destination, beginning with a scenic coastal drive along winding roads that offer spectacular glimpses of dramatic cliffs, secluded coves, traditional fishing villages, and endless stretches of golden sandy beaches fringed by swaying coconut palms and crystal-clear turquoise lagoons. Spend your day at some of the most breathtaking beaches featuring powdery white sand so fine it feels like silk beneath your feet, where you can swim in warm, inviting waters with visibility extending up to 30 meters, snorkel among vibrant coral reefs teeming with colorful tropical fish, parrotfish, and sea turtles, or simply relax under the shade of traditional bamboo umbrellas while sipping fresh coconut water and soaking up the glorious tropical sunshine. Embark on an exciting speedboat or traditional wooden boat excursion to explore hidden islands, secret lagoons, and pristine beaches accessible only by water, where you'll discover untouched natural beauty, dramatic limestone formations rising from emerald waters, mysterious sea caves with stunning stalactite formations, and secluded beaches where you might be the only visitors enjoying the tranquility and pristine natural splendor. Indulge in a magnificent beachside seafood feast featuring the day's freshest catch prepared by local chefs using traditional recipes and cooking methods, including grilled fish with aromatic herbs and spices, succulent prawns, tropical lobster, exotic fruit salads, and refreshing beverages served right on the sand with the gentle sound of waves providing natural background music. As the day draws to a close, position yourself at one of the most spectacular sunset viewpoints in the region - perhaps on a dramatic clifftop overlooking the infinite ocean, aboard a traditional sailing vessel, or on a pristine beach - where you'll witness one of nature's most magnificent daily spectacles as the sun transforms the sky into a canvas of brilliant oranges, deep purples, magenta pinks, and golden yellows before slowly disappearing into the endless ocean horizon, creating a magical moment you'll treasure forever.`
                            )}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            ${getDurationDays(pkg.duration) > 4 ? `
            <div class="itinerary-day" id="day-4">
                <div class="day-header" onclick="toggleDay(4)">
                    <div class="day-info">
                        <div class="day-number">Day 5</div>
                    </div>
                    <svg class="day-toggle" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M6 8l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </div>
                <div class="day-content">
                    <div class="day-details">
                        <div class="day-description">
                            <p>${getContent(
                                `Experience a transformative wellness day at renowned spa sanctuaries blending ancient healing with modern techniques. Enjoy personalized treatments including massages, body wraps, and therapies in natural settings. Participate in meditation and yoga classes. Nourish your body with organic meals featuring healing ingredients.`,
                                `Immerse yourself completely in a transformative day dedicated to holistic wellness, spiritual rejuvenation, and inner harmony at world-renowned spa and wellness sanctuaries that seamlessly blend ancient healing traditions with cutting-edge modern therapeutic techniques, creating an oasis of peace and tranquility where mind, body, and spirit can find perfect balance. Begin your wellness journey with a comprehensive consultation conducted by experienced traditional healers and certified therapists who will assess your individual needs, stress levels, and wellness goals before customizing a personalized treatment program using premium natural ingredients, rare aromatic herbs, essential oils extracted from local plants, and time-honored methodologies that have been passed down through generations of master healers. Experience authentic therapeutic treatments including full-body massages using traditional techniques and heated volcanic stones, detoxifying body wraps with organic seaweed and mineral-rich mud, rejuvenating facial therapies using natural fruit enzymes and botanical extracts, and specialized healing sessions in serene treatment rooms surrounded by lush tropical gardens, flowing water features, and the soothing sounds of nature that enhance the healing process and promote deep relaxation. Participate in guided meditation sessions and gentle yoga classes led by certified instructors in breathtaking natural settings such as ancient temple gardens with centuries-old trees, peaceful riverside platforms with the sound of flowing water, mountaintop pavilions offering panoramic views, or beachside pavillions at sunrise where you can connect with your inner self while surrounded by the raw beauty of nature and feel a profound sense of peace and spiritual awakening. Nourish your body with carefully prepared organic meals featuring fresh local ingredients known for their health benefits and healing properties, including antioxidant-rich tropical fruits, healing herbs and spices, specially prepared detox beverages, raw food preparations, and ancient superfood combinations that promote wellness, vitality, and natural energy while supporting your body's natural healing processes.`
                            )}</p>
                        </div>
                    </div>
                </div>
            </div>
            ` : ''}
            
            ${getDurationDays(pkg.duration) > 5 ? `
            <div class="itinerary-day" id="day-5">
                <div class="day-header" onclick="toggleDay(5)">
                    <div class="day-info">
                        <div class="day-number">Day 6</div>
                    </div>
                    <svg class="day-toggle" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M6 8l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </div>
                <div class="day-content">
                    <div class="day-details">
                        <div class="day-description">
                            <p>${getContent(
                                `Visit authentic rural communities and traditional villages where time stands still. Meet welcoming local families who share their customs and ancestral wisdom. Participate in hands-on activities like traditional cooking classes and handicraft workshops with master artisans. Experience rural hospitality through home-cooked meals and folk performances.`,
                                `Venture deep into authentic rural communities and traditional villages where time seems to have stood completely still, offering you an extraordinary and rare glimpse into centuries-old ways of life, cultural practices, and social traditions that remain beautifully unchanged by modern development and globalization, providing an invaluable opportunity to witness how indigenous communities have preserved their ancestral wisdom and sustainable living practices. Meet incredibly welcoming local families who will open their homes and hearts to share their daily routines, traditional customs, agricultural practices, and ancestral wisdom while treating you as honored guests in their close-knit community, sharing stories about their heritage, explaining the significance of local festivals and ceremonies, and demonstrating how they maintain harmony with nature through sustainable farming and eco-friendly practices. Participate enthusiastically in hands-on cultural activities and immersive experiences such as traditional cooking classes using age-old recipes and authentic cooking methods, learning to prepare signature local dishes with ingredients freshly harvested from family gardens and nearby organic farms, understanding the cultural significance of each ingredient and cooking technique while creating memorable meals that connect you to generations of culinary tradition. Engage in fascinating handicraft workshops where master artisans with decades of experience will patiently teach you traditional techniques for creating beautiful handmade items such as intricately woven textiles using natural dyes and traditional looms, pottery crafted from local clay using methods unchanged for centuries, detailed wood carvings that tell stories of local legends, or exquisite jewelry made with traditional tools and techniques passed down through generations of skilled craftspeople. Experience the genuine warmth and hospitality of rural life as you share hearty home-cooked meals prepared with love by local families, listen to captivating traditional stories and ancient folklore passed down orally through generations, and perhaps join in traditional dances, folk music performances, or ceremonial activities that celebrate the rich cultural heritage, community spirit, and deep spiritual connection to the land that defines these remarkable traditional communities.`
                            )}</p>
                        </div>
                    </div>
                </div>
            </div>
            ` : ''}
            
            <div class="itinerary-day" id="day-final">
                <div class="day-header" onclick="toggleDay('final')">
                    <div class="day-info">
                        <div class="day-number">Day ${getDurationDays(pkg.duration)}</div>
                    </div>
                    <svg class="day-toggle" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M6 8l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </div>
                <div class="day-content">
                    <div class="day-details">
                        <div class="day-description">
                            <p>${getContent(
                                `Enjoy a leisurely breakfast while reflecting on incredible experiences during your stay. Complete check-out procedures with staff assistance and enjoy free time for souvenir shopping at local markets. Our representative will provide comfortable airport transfer assistance. Depart ${pkg.location} with beautiful memories and cultural appreciation.`,
                                `Savor your final precious morning in this enchanting destination with a leisurely and indulgent breakfast featuring all your favorite local dishes and international specialties you've discovered and fallen in love with during your transformative stay, taking ample time to reflect deeply on all the incredible experiences, meaningful friendships, eye-opening cultural encounters, and unforgettable memories you've created during this life-changing journey that has broadened your perspective and enriched your understanding of the world. Complete your hotel check-out procedures with personalized assistance from our attentive staff members who will ensure all your belongings are carefully packed, verify that any special arrangements or requests are confirmed for your departure day, assist with luggage handling, and provide you with detailed information about your departure schedule, transfer timing, and any final travel requirements or documentation needed for your journey home. Enjoy some precious free time for comprehensive last-minute souvenir shopping at bustling local markets, authentic artisan workshops, or specialty boutique stores where you can find unique gifts, handcrafted mementos, and meaningful keepsakes that will help you remember and share this amazing adventure with family and friends - perhaps selecting traditional handicrafts that support local artisan communities, aromatic spices and specialty teas that will remind you of local flavors, beautiful textiles with intricate patterns and vibrant colors, or original artwork and sculptures created by talented local artists you've had the privilege to meet during your cultural explorations. Our dedicated and professional representative will ensure your comfortable, punctual, and stress-free transfer to the international airport, providing attentive assistance with all your luggage, guiding you through check-in procedures with airline staff, helping with any special requests or seat preferences, and offering any final travel assistance or local insights you may need for your onward journey or future travel plans to this remarkable destination. As you bid a heartfelt farewell to ${pkg.location} and board your aircraft for the journey home, carry with you not just beautiful photographs and carefully selected souvenirs, but a heart overflowing with precious memories, a deeper appreciation and respect for different cultures and ways of life, meaningful connections with the wonderful people you've met along the way, and perhaps a completely new perspective on life gained through this incredible, transformative, and enriching travel experience with Trip On that will inspire your future adventures and remain with you for the rest of your life.`
                            )}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Load policies with package-specific data
    loadPolicyContent(pkg);
}

// Update trip overview to reflect actual travel content
function loadTripOverview(pkg) {
    // Update overview content based on destination
    const overviewAccommodation = document.getElementById('overviewAccommodation');
    const overviewTransport = document.getElementById('overviewTransport');
    const overviewMeals = document.getElementById('overviewMeals');
    const overviewActivities = document.getElementById('overviewActivities');
    
    if (overviewAccommodation) {
        overviewAccommodation.textContent = `${pkg.type} category hotels and resorts with modern amenities, swimming pools, and scenic views`;
    }
    
    if (overviewTransport) {
        overviewTransport.textContent = `Private air-conditioned vehicles, airport transfers, inter-city transport, and boat transfers for island visits`;
    }
    
    if (overviewMeals) {
        overviewMeals.textContent = `Daily breakfast, welcome drinks, selected lunches at scenic locations, and traditional dinner experiences`;
    }
    
    if (overviewActivities) {
        overviewActivities.textContent = `Temple visits, cultural tours, nature exploration, water sports, spa treatments, and authentic local experiences`;
    }
}

function getDurationDays(duration) {
    const days = duration.match(/(\d+)\s*Days?/i);
    return days ? parseInt(days[1]) : 4;
}

function loadPolicyContent(pkg) {
    // Update cancellation policy
    const cancellationText = document.getElementById('cancellationPolicyText');
    if (cancellationText) {
        cancellationText.textContent = pkg.cancellationPolicy || 
            'Cancellation charges: 25% of total cost if cancelled 15 days before departure, 50% if cancelled 7 days before, 100% if cancelled within 3 days of departure. Refunds processed within 7-10 working days.';
    }
    
    // Update instructions
    const instructionsText = document.getElementById('instructionsPolicyText');
    if (instructionsText) {
        instructionsText.textContent = pkg.instructions || 
            'Please carry valid government ID proof, comfortable walking shoes, weather-appropriate clothing, and personal medications. Check-in time is 2:00 PM and check-out is 11:00 AM. Inform us of any dietary restrictions or special requirements in advance.';
    }
}

function loadBudgetTab(pkg) {
    // Load inclusions
    const inclusionsList = document.getElementById('inclusionsList');
    if (inclusionsList && pkg.inclusions && pkg.inclusions.length > 0) {
        inclusionsList.innerHTML = pkg.inclusions.map(item => `<li>${item}</li>`).join('');
    }
    
    // Load exclusions
    const exclusionsList = document.getElementById('exclusionsList');
    if (exclusionsList && pkg.exclusions && pkg.exclusions.length > 0) {
        exclusionsList.innerHTML = pkg.exclusions.map(item => `<li>${item}</li>`).join('');
    }
    
    // Load statistics
    document.getElementById('statBookings').textContent = pkg.bookingsCount || 0;
    document.getElementById('statRating').textContent = `${pkg.rating || 0} ⭐`;
    document.getElementById('statReviews').textContent = pkg.reviewCount || 0;
    document.getElementById('statAvailability').textContent = pkg.availability || 'Available';
}

function loadHotelsTab(pkg) {
    const hotelsList = document.getElementById('hotelsList');
    if (!hotelsList) return;
    
    // Default hotel information
    hotelsList.innerHTML = `
        <div class="hotel-item">
            <div class="hotel-icon">🏨</div>
            <div class="hotel-details">
                <h4>Accommodation Type</h4>
                <p>${pkg.type} category hotels with modern amenities including AC, WiFi, and breakfast facilities.</p>
            </div>
        </div>
        <div class="hotel-item">
            <div class="hotel-icon">🍽️</div>
            <div class="hotel-details">
                <h4>Meal Plan</h4>
                <p>Daily breakfast included at the hotel. Other meals as specified in the package itinerary.</p>
            </div>
        </div>
        <div class="hotel-item">
            <div class="hotel-icon">🛏️</div>
            <div class="hotel-details">
                <h4>Room Category</h4>
                <p>Standard double/twin sharing rooms. Extra bed available on request for additional charges.</p>
            </div>
        </div>
    `;
}

// ============================================================================
// TAB SWITCHING
// ============================================================================

function switchDetailTab(tabName) {
    currentTab = tabName;
    
    // Update tab buttons
    document.querySelectorAll('.package-tab').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        }
    });
    
    // Show/hide tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    const activeTab = document.getElementById(`${tabName}Tab`);
    if (activeTab) {
        activeTab.classList.add('active');
    }
}

// ============================================================================
// ACCORDION TOGGLES
// ============================================================================

function toggleDay(dayIndex) {
    const dayElement = document.getElementById(`day-${dayIndex}`);
    if (dayElement) {
        dayElement.classList.toggle('open');
    }
}

function togglePolicy(policyType) {
    const policyItem = document.querySelector(`#${policyType}Policy`).parentElement;
    if (policyItem) {
        policyItem.classList.toggle('open');
    }
}

// ============================================================================
// NAVIGATION
// ============================================================================

function goBack() {
    window.location.href = 'admin-packages.html';
}

function editCurrentPackage() {
    if (currentPackage) {
        window.location.href = `admin-package-form.html?edit=${currentPackage.id}`;
    }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function getCategoryText(category) {
    const categoryMap = {
        '4nights': '3N4D',
        '5nights': '4N5D',
        '6nights': '5N6D',
        '7nights': '6N7D',
        'custom': 'Custom'
    };
    return categoryMap[category] || category;
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

function showError(message) {
    const container = document.querySelector('.package-view-container');
    if (container) {
        container.innerHTML = `
            <div style="text-align: center; padding: 60px 20px;">
                <h2 style="color: #dc2626; margin-bottom: 16px;">Error</h2>
                <p style="color: #6b7280; margin-bottom: 24px;">${message}</p>
                <button onclick="goBack()" class="btn-edit-package">Go Back to Packages</button>
            </div>
        `;
    }
}

// ============================================================================
// EXPORT FUNCTIONS FOR GLOBAL ACCESS
// ============================================================================

window.switchDetailTab = switchDetailTab;
window.toggleDay = toggleDay;
window.togglePolicy = togglePolicy;
window.goBack = goBack;
window.editCurrentPackage = editCurrentPackage;
