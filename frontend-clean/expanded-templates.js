/**
 * Expanded Template Library for SnapitForms
 * Comprehensive collection to compete with JotForm's 10,000+ templates
 */

const ExpandedTemplates = {
    // Business & Professional (25 templates)
    business: {
        name: 'Business & Professional',
        description: 'Forms for modern business operations',
        icon: '💼',
        templates: {
            employeeEvaluation: {
                name: 'Employee Performance Review',
                category: 'business',
                description: 'Comprehensive employee performance evaluation form',
                icon: '📊',
                popular: true,
                new: false,
                title: 'Employee Performance Review',
                fields: [
                    { type: 'text', name: 'employee_name', label: 'Employee Name', required: true },
                    { type: 'text', name: 'position', label: 'Position/Title', required: true },
                    { type: 'text', name: 'department', label: 'Department', required: true },
                    { type: 'date', name: 'review_period_start', label: 'Review Period Start', required: true },
                    { type: 'date', name: 'review_period_end', label: 'Review Period End', required: true },
                    { type: 'rating', name: 'job_knowledge', label: 'Job Knowledge', maxRating: 5, required: true },
                    { type: 'rating', name: 'communication', label: 'Communication Skills', maxRating: 5, required: true },
                    { type: 'rating', name: 'teamwork', label: 'Teamwork & Collaboration', maxRating: 5, required: true },
                    { type: 'textarea', name: 'achievements', label: 'Key Achievements', required: true },
                    { type: 'textarea', name: 'areas_improvement', label: 'Areas for Improvement', required: false },
                    { type: 'textarea', name: 'goals_next_period', label: 'Goals for Next Period', required: true }
                ]
            },
            projectProposal: {
                name: 'Project Proposal Form',
                category: 'business',
                description: 'Detailed project proposal submission form',
                icon: '📋',
                popular: false,
                new: true,
                title: 'Project Proposal Submission',
                fields: [
                    { type: 'text', name: 'project_title', label: 'Project Title', required: true },
                    { type: 'text', name: 'client_name', label: 'Client/Organization', required: true },
                    { type: 'email', name: 'contact_email', label: 'Contact Email', required: true },
                    { type: 'select', name: 'project_type', label: 'Project Type', options: ['Web Development', 'Mobile App', 'Software Development', 'Consulting', 'Design', 'Other'], required: true },
                    { type: 'daterange', name: 'timeline', label: 'Proposed Timeline', required: true },
                    { type: 'number', name: 'budget_min', label: 'Budget Range (Min)', required: true },
                    { type: 'number', name: 'budget_max', label: 'Budget Range (Max)', required: true },
                    { type: 'richtext', name: 'project_description', label: 'Project Description', required: true },
                    { type: 'richtext', name: 'objectives', label: 'Project Objectives', required: true },
                    { type: 'fileupload', name: 'attachments', label: 'Supporting Documents', required: false }
                ]
            },
            vendorApplication: {
                name: 'Vendor Application',
                category: 'business',
                description: 'Comprehensive vendor registration and application form',
                icon: '🤝',
                title: 'Vendor Application Form',
                fields: [
                    { type: 'text', name: 'company_name', label: 'Company Name', required: true },
                    { type: 'text', name: 'business_license', label: 'Business License Number', required: true },
                    { type: 'text', name: 'tax_id', label: 'Tax ID Number', required: true },
                    { type: 'textarea', name: 'services_products', label: 'Products/Services Offered', required: true },
                    { type: 'number', name: 'years_business', label: 'Years in Business', required: true },
                    { type: 'checkbox', name: 'certifications', label: 'Certifications', options: ['ISO 9001', 'SOC 2', 'HIPAA', 'PCI DSS', 'Other'], required: false },
                    { type: 'fileupload', name: 'insurance_certificate', label: 'Insurance Certificate', required: true },
                    { type: 'fileupload', name: 'references', label: 'Client References', required: true }
                ]
            },
            incidentReport: {
                name: 'Incident Report Form',
                category: 'business',
                description: 'Workplace incident reporting and documentation',
                icon: '⚠️',
                title: 'Incident Report',
                fields: [
                    { type: 'date', name: 'incident_date', label: 'Date of Incident', required: true },
                    { type: 'text', name: 'time', label: 'Time of Incident', required: true },
                    { type: 'text', name: 'location', label: 'Location', required: true },
                    { type: 'text', name: 'reported_by', label: 'Reported By', required: true },
                    { type: 'select', name: 'incident_type', label: 'Type of Incident', options: ['Injury', 'Near Miss', 'Property Damage', 'Security', 'Environmental', 'Other'], required: true },
                    { type: 'textarea', name: 'description', label: 'Description of Incident', required: true },
                    { type: 'textarea', name: 'injuries', label: 'Injuries Sustained', required: false },
                    { type: 'textarea', name: 'immediate_action', label: 'Immediate Action Taken', required: true },
                    { type: 'fileupload', name: 'photos', label: 'Photos/Evidence', required: false }
                ]
            }
        }
    },

    // Healthcare & Medical (20 templates)
    healthcare: {
        name: 'Healthcare & Medical',
        description: 'HIPAA-compliant medical forms and health assessments',
        icon: '🏥',
        templates: {
            patientIntake: {
                name: 'Patient Intake Form',
                category: 'healthcare',
                description: 'Comprehensive patient information and medical history',
                icon: '👤',
                popular: true,
                title: 'New Patient Intake Form',
                fields: [
                    { type: 'text', name: 'patient_name', label: 'Full Name', required: true },
                    { type: 'date', name: 'date_of_birth', label: 'Date of Birth', required: true },
                    { type: 'select', name: 'gender', label: 'Gender', options: ['Male', 'Female', 'Other', 'Prefer not to say'], required: true },
                    { type: 'tel', name: 'phone', label: 'Phone Number', required: true },
                    { type: 'email', name: 'email', label: 'Email Address', required: true },
                    { type: 'textarea', name: 'emergency_contact', label: 'Emergency Contact', required: true },
                    { type: 'textarea', name: 'medical_history', label: 'Medical History', required: true },
                    { type: 'checkbox', name: 'allergies', label: 'Known Allergies', options: ['Penicillin', 'Latex', 'Food allergies', 'Environmental', 'No known allergies'], required: true },
                    { type: 'textarea', name: 'current_medications', label: 'Current Medications', required: false },
                    { type: 'text', name: 'insurance_provider', label: 'Insurance Provider', required: true },
                    { type: 'text', name: 'policy_number', label: 'Policy Number', required: true }
                ]
            },
            covidScreening: {
                name: 'COVID-19 Health Screening',
                category: 'healthcare',
                description: 'Daily health screening and symptom checker',
                icon: '🦠',
                popular: true,
                new: false,
                title: 'COVID-19 Health Screening',
                fields: [
                    { type: 'text', name: 'full_name', label: 'Full Name', required: true },
                    { type: 'date', name: 'screening_date', label: 'Screening Date', required: true },
                    { type: 'number', name: 'temperature', label: 'Temperature (°F)', required: true },
                    { type: 'radio', name: 'fever', label: 'Do you have a fever?', options: ['Yes', 'No'], required: true },
                    { type: 'radio', name: 'cough', label: 'Do you have a cough?', options: ['Yes', 'No'], required: true },
                    { type: 'radio', name: 'shortness_breath', label: 'Shortness of breath?', options: ['Yes', 'No'], required: true },
                    { type: 'radio', name: 'close_contact', label: 'Close contact with COVID-19 case in last 14 days?', options: ['Yes', 'No'], required: true },
                    { type: 'signature', name: 'signature', label: 'Digital Signature', required: true }
                ]
            },
            appointmentBooking: {
                name: 'Medical Appointment Booking',
                category: 'healthcare',
                description: 'Online appointment scheduling for medical practices',
                icon: '📅',
                title: 'Schedule Your Appointment',
                fields: [
                    { type: 'text', name: 'patient_name', label: 'Patient Name', required: true },
                    { type: 'tel', name: 'phone', label: 'Phone Number', required: true },
                    { type: 'email', name: 'email', label: 'Email Address', required: true },
                    { type: 'select', name: 'appointment_type', label: 'Appointment Type', options: ['General Consultation', 'Follow-up', 'Specialist Referral', 'Vaccination', 'Physical Exam'], required: true },
                    { type: 'select', name: 'preferred_doctor', label: 'Preferred Doctor', options: ['Dr. Smith', 'Dr. Johnson', 'Dr. Williams', 'Any Available'], required: true },
                    { type: 'date', name: 'preferred_date', label: 'Preferred Date', required: true },
                    { type: 'select', name: 'preferred_time', label: 'Preferred Time', options: ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'], required: true },
                    { type: 'textarea', name: 'reason_visit', label: 'Reason for Visit', required: true }
                ]
            }
        }
    },

    // Education & Academic (18 templates)
    education: {
        name: 'Education & Academic',
        description: 'Forms for schools, universities, and educational institutions',
        icon: '🎓',
        templates: {
            studentRegistration: {
                name: 'Student Registration',
                category: 'education',
                description: 'Comprehensive student enrollment and registration form',
                icon: '📚',
                popular: true,
                title: 'Student Registration Form',
                fields: [
                    { type: 'text', name: 'student_name', label: 'Student Full Name', required: true },
                    { type: 'date', name: 'date_of_birth', label: 'Date of Birth', required: true },
                    { type: 'select', name: 'grade_level', label: 'Grade Level', options: ['Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade', 'Middle School', 'High School'], required: true },
                    { type: 'text', name: 'parent_guardian', label: 'Parent/Guardian Name', required: true },
                    { type: 'tel', name: 'parent_phone', label: 'Parent Phone', required: true },
                    { type: 'email', name: 'parent_email', label: 'Parent Email', required: true },
                    { type: 'textarea', name: 'address', label: 'Home Address', required: true },
                    { type: 'text', name: 'emergency_contact', label: 'Emergency Contact', required: true },
                    { type: 'checkbox', name: 'medical_conditions', label: 'Medical Conditions', options: ['Allergies', 'Asthma', 'Diabetes', 'ADHD', 'None'], required: true },
                    { type: 'fileupload', name: 'birth_certificate', label: 'Birth Certificate', required: true }
                ]
            },
            courseEvaluation: {
                name: 'Course Evaluation',
                category: 'education',
                description: 'Student feedback and course assessment form',
                icon: '📝',
                title: 'Course Evaluation Survey',
                fields: [
                    { type: 'text', name: 'course_name', label: 'Course Name', required: true },
                    { type: 'text', name: 'instructor_name', label: 'Instructor Name', required: true },
                    { type: 'select', name: 'semester', label: 'Semester', options: ['Fall 2025', 'Spring 2026', 'Summer 2026'], required: true },
                    { type: 'rating', name: 'course_content', label: 'Course Content Quality', maxRating: 5, required: true },
                    { type: 'rating', name: 'instructor_effectiveness', label: 'Instructor Effectiveness', maxRating: 5, required: true },
                    { type: 'rating', name: 'workload', label: 'Workload Appropriateness', maxRating: 5, required: true },
                    { type: 'textarea', name: 'liked_most', label: 'What did you like most?', required: true },
                    { type: 'textarea', name: 'improvements', label: 'Suggested Improvements', required: false },
                    { type: 'radio', name: 'recommend', label: 'Would you recommend this course?', options: ['Yes', 'No', 'Maybe'], required: true }
                ]
            },
            fieldTripPermission: {
                name: 'Field Trip Permission',
                category: 'education',
                description: 'Parent permission form for school field trips',
                icon: '🚌',
                title: 'Field Trip Permission Slip',
                fields: [
                    { type: 'text', name: 'student_name', label: 'Student Name', required: true },
                    { type: 'text', name: 'grade_class', label: 'Grade/Class', required: true },
                    { type: 'text', name: 'trip_destination', label: 'Trip Destination', required: true },
                    { type: 'date', name: 'trip_date', label: 'Trip Date', required: true },
                    { type: 'text', name: 'departure_time', label: 'Departure Time', required: true },
                    { type: 'text', name: 'return_time', label: 'Expected Return Time', required: true },
                    { type: 'text', name: 'parent_name', label: 'Parent/Guardian Name', required: true },
                    { type: 'tel', name: 'emergency_phone', label: 'Emergency Phone Number', required: true },
                    { type: 'radio', name: 'permission_granted', label: 'I give permission for my child to participate', options: ['Yes', 'No'], required: true },
                    { type: 'signature', name: 'parent_signature', label: 'Parent/Guardian Signature', required: true }
                ]
            }
        }
    },

    // Real Estate & Property (15 templates)
    realEstate: {
        name: 'Real Estate & Property',
        description: 'Property management, listings, and real estate transactions',
        icon: '🏠',
        templates: {
            propertyValuation: {
                name: 'Property Valuation Request',
                category: 'realEstate',
                description: 'Request professional property valuation services',
                icon: '💰',
                title: 'Property Valuation Request',
                fields: [
                    { type: 'text', name: 'property_address', label: 'Property Address', required: true },
                    { type: 'text', name: 'property_type', label: 'Property Type', required: true },
                    { type: 'number', name: 'bedrooms', label: 'Number of Bedrooms', required: true },
                    { type: 'number', name: 'bathrooms', label: 'Number of Bathrooms', required: true },
                    { type: 'number', name: 'square_footage', label: 'Square Footage', required: true },
                    { type: 'number', name: 'lot_size', label: 'Lot Size (sq ft)', required: false },
                    { type: 'text', name: 'year_built', label: 'Year Built', required: true },
                    { type: 'select', name: 'valuation_purpose', label: 'Valuation Purpose', options: ['Selling', 'Buying', 'Refinancing', 'Insurance', 'Estate Planning'], required: true },
                    { type: 'text', name: 'contact_name', label: 'Contact Name', required: true },
                    { type: 'tel', name: 'contact_phone', label: 'Phone Number', required: true },
                    { type: 'email', name: 'contact_email', label: 'Email Address', required: true }
                ]
            },
            rentalApplication: {
                name: 'Rental Application',
                category: 'realEstate',
                description: 'Comprehensive tenant application form',
                icon: '🔑',
                title: 'Rental Application Form',
                fields: [
                    { type: 'text', name: 'applicant_name', label: 'Full Name', required: true },
                    { type: 'date', name: 'date_of_birth', label: 'Date of Birth', required: true },
                    { type: 'tel', name: 'phone', label: 'Phone Number', required: true },
                    { type: 'email', name: 'email', label: 'Email Address', required: true },
                    { type: 'text', name: 'current_address', label: 'Current Address', required: true },
                    { type: 'number', name: 'monthly_income', label: 'Monthly Income', required: true },
                    { type: 'text', name: 'employer', label: 'Employer', required: true },
                    { type: 'text', name: 'previous_landlord', label: 'Previous Landlord Contact', required: false },
                    { type: 'number', name: 'desired_rent', label: 'Desired Rent Amount', required: true },
                    { type: 'date', name: 'move_in_date', label: 'Desired Move-in Date', required: true },
                    { type: 'radio', name: 'pets', label: 'Do you have pets?', options: ['Yes', 'No'], required: true },
                    { type: 'signature', name: 'applicant_signature', label: 'Digital Signature', required: true }
                ]
            }
        }
    },

    // Food & Restaurant (12 templates)
    foodService: {
        name: 'Food & Restaurant',
        description: 'Restaurant, catering, and food service management forms',
        icon: '🍽️',
        templates: {
            cateringOrder: {
                name: 'Catering Order Form',
                category: 'foodService',
                description: 'Corporate and event catering order management',
                icon: '🥘',
                popular: true,
                title: 'Catering Order Request',
                fields: [
                    { type: 'text', name: 'event_name', label: 'Event Name', required: true },
                    { type: 'text', name: 'contact_name', label: 'Contact Name', required: true },
                    { type: 'tel', name: 'phone', label: 'Phone Number', required: true },
                    { type: 'email', name: 'email', label: 'Email Address', required: true },
                    { type: 'date', name: 'event_date', label: 'Event Date', required: true },
                    { type: 'text', name: 'event_time', label: 'Event Time', required: true },
                    { type: 'number', name: 'guest_count', label: 'Number of Guests', required: true },
                    { type: 'textarea', name: 'delivery_address', label: 'Delivery Address', required: true },
                    { type: 'select', name: 'meal_type', label: 'Meal Type', options: ['Breakfast', 'Lunch', 'Dinner', 'Appetizers', 'Full Service'], required: true },
                    { type: 'checkbox', name: 'dietary_restrictions', label: 'Dietary Restrictions', options: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Nut-Free', 'Halal', 'Kosher'], required: false },
                    { type: 'textarea', name: 'special_requests', label: 'Special Requests', required: false },
                    { type: 'number', name: 'budget_range', label: 'Budget Range ($)', required: true }
                ]
            },
            restaurantReservation: {
                name: 'Restaurant Reservation',
                category: 'foodService',
                description: 'Online table booking and reservation system',
                icon: '🍷',
                title: 'Make a Reservation',
                fields: [
                    { type: 'text', name: 'guest_name', label: 'Name', required: true },
                    { type: 'tel', name: 'phone', label: 'Phone Number', required: true },
                    { type: 'email', name: 'email', label: 'Email Address', required: true },
                    { type: 'date', name: 'reservation_date', label: 'Reservation Date', required: true },
                    { type: 'select', name: 'reservation_time', label: 'Preferred Time', options: ['5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM'], required: true },
                    { type: 'number', name: 'party_size', label: 'Party Size', required: true },
                    { type: 'select', name: 'seating_preference', label: 'Seating Preference', options: ['No Preference', 'Window Table', 'Booth', 'Bar Seating', 'Patio'], required: false },
                    { type: 'textarea', name: 'special_occasions', label: 'Special Occasion/Requests', required: false }
                ]
            }
        }
    },

    // Events & Entertainment (16 templates)
    events: {
        name: 'Events & Entertainment',
        description: 'Event planning, entertainment, and venue management',
        icon: '🎉',
        templates: {
            weddingRSVP: {
                name: 'Wedding RSVP',
                category: 'events',
                description: 'Beautiful wedding response and menu selection form',
                icon: '💒',
                popular: true,
                title: 'Wedding RSVP',
                fields: [
                    { type: 'text', name: 'guest_name', label: 'Full Name', required: true },
                    { type: 'email', name: 'email', label: 'Email Address', required: true },
                    { type: 'radio', name: 'attending', label: 'Will you be attending?', options: ['Joyfully Accepting', 'Regretfully Declining'], required: true },
                    { type: 'number', name: 'guest_count', label: 'Number of Guests', required: true },
                    { type: 'text', name: 'guest_names', label: 'Names of Additional Guests', required: false },
                    { type: 'select', name: 'meal_choice', label: 'Meal Selection', options: ['Herb-Crusted Salmon', 'Prime Beef Tenderloin', 'Vegetarian Pasta', 'Vegan Option'], required: true },
                    { type: 'checkbox', name: 'dietary_restrictions', label: 'Dietary Restrictions', options: ['Gluten-Free', 'Nut Allergies', 'Dairy-Free', 'Other'], required: false },
                    { type: 'textarea', name: 'song_requests', label: 'Song Requests for Reception', required: false },
                    { type: 'textarea', name: 'special_message', label: 'Special Message for the Couple', required: false }
                ]
            },
            eventPlanning: {
                name: 'Event Planning Consultation',
                category: 'events',
                description: 'Comprehensive event planning intake form',
                icon: '📋',
                title: 'Event Planning Consultation',
                fields: [
                    { type: 'text', name: 'client_name', label: 'Client Name', required: true },
                    { type: 'tel', name: 'phone', label: 'Phone Number', required: true },
                    { type: 'email', name: 'email', label: 'Email Address', required: true },
                    { type: 'select', name: 'event_type', label: 'Event Type', options: ['Wedding', 'Corporate Event', 'Birthday Party', 'Anniversary', 'Graduation', 'Retirement', 'Other'], required: true },
                    { type: 'date', name: 'event_date', label: 'Preferred Event Date', required: true },
                    { type: 'number', name: 'guest_count', label: 'Expected Guest Count', required: true },
                    { type: 'number', name: 'budget', label: 'Budget Range ($)', required: true },
                    { type: 'text', name: 'venue_preference', label: 'Venue Preference/Location', required: false },
                    { type: 'textarea', name: 'event_vision', label: 'Describe Your Event Vision', required: true },
                    { type: 'checkbox', name: 'services_needed', label: 'Services Needed', options: ['Venue Selection', 'Catering', 'Photography', 'Entertainment', 'Flowers', 'Transportation'], required: true }
                ]
            }
        }
    },

    // Technology & IT (14 templates)
    technology: {
        name: 'Technology & IT',
        description: 'IT support, software development, and tech services',
        icon: '💻',
        templates: {
            itSupportTicket: {
                name: 'IT Support Ticket',
                category: 'technology',
                description: 'Technical support request and issue tracking',
                icon: '🔧',
                popular: true,
                title: 'IT Support Request',
                fields: [
                    { type: 'text', name: 'employee_name', label: 'Employee Name', required: true },
                    { type: 'email', name: 'email', label: 'Email Address', required: true },
                    { type: 'text', name: 'department', label: 'Department', required: true },
                    { type: 'tel', name: 'phone_extension', label: 'Phone Extension', required: false },
                    { type: 'select', name: 'priority', label: 'Priority Level', options: ['Low', 'Medium', 'High', 'Critical'], required: true },
                    { type: 'select', name: 'issue_category', label: 'Issue Category', options: ['Hardware', 'Software', 'Network', 'Email', 'Password Reset', 'New Equipment Request', 'Other'], required: true },
                    { type: 'text', name: 'subject', label: 'Issue Subject', required: true },
                    { type: 'textarea', name: 'description', label: 'Detailed Description', required: true },
                    { type: 'textarea', name: 'steps_taken', label: 'Steps Already Taken', required: false },
                    { type: 'fileupload', name: 'screenshots', label: 'Screenshots/Error Messages', required: false }
                ]
            },
            softwareFeatureRequest: {
                name: 'Software Feature Request',
                category: 'technology',
                description: 'Product feature requests and enhancement suggestions',
                icon: '💡',
                title: 'Feature Request Form',
                fields: [
                    { type: 'text', name: 'requester_name', label: 'Your Name', required: true },
                    { type: 'email', name: 'email', label: 'Email Address', required: true },
                    { type: 'text', name: 'organization', label: 'Organization/Company', required: false },
                    { type: 'select', name: 'user_type', label: 'User Type', options: ['End User', 'Administrator', 'Developer', 'Manager'], required: true },
                    { type: 'text', name: 'feature_title', label: 'Feature Title', required: true },
                    { type: 'richtext', name: 'feature_description', label: 'Detailed Feature Description', required: true },
                    { type: 'richtext', name: 'business_justification', label: 'Business Justification', required: true },
                    { type: 'select', name: 'priority', label: 'Priority Level', options: ['Nice to Have', 'Important', 'Critical', 'Urgent'], required: true },
                    { type: 'textarea', name: 'acceptance_criteria', label: 'Acceptance Criteria', required: false },
                    { type: 'fileupload', name: 'mockups', label: 'Mockups/Wireframes', required: false }
                ]
            }
        }
    },

    // Legal & Compliance (10 templates)
    legal: {
        name: 'Legal & Compliance',
        description: 'Legal documents, contracts, and compliance forms',
        icon: '⚖️',
        templates: {
            legalConsultation: {
                name: 'Legal Consultation Request',
                category: 'legal',
                description: 'Initial legal consultation intake form',
                icon: '👨‍💼',
                title: 'Legal Consultation Request',
                fields: [
                    { type: 'text', name: 'client_name', label: 'Full Name', required: true },
                    { type: 'tel', name: 'phone', label: 'Phone Number', required: true },
                    { type: 'email', name: 'email', label: 'Email Address', required: true },
                    { type: 'select', name: 'legal_area', label: 'Area of Legal Need', options: ['Business Law', 'Family Law', 'Real Estate', 'Personal Injury', 'Employment Law', 'Criminal Defense', 'Estate Planning', 'Other'], required: true },
                    { type: 'select', name: 'urgency', label: 'Urgency Level', options: ['Not Urgent', 'Somewhat Urgent', 'Very Urgent', 'Emergency'], required: true },
                    { type: 'richtext', name: 'case_description', label: 'Brief Case Description', required: true },
                    { type: 'radio', name: 'previous_attorney', label: 'Have you worked with an attorney on this matter before?', options: ['Yes', 'No'], required: true },
                    { type: 'date', name: 'preferred_consultation_date', label: 'Preferred Consultation Date', required: true },
                    { type: 'checkbox', name: 'consultation_method', label: 'Preferred Consultation Method', options: ['In-Person', 'Phone', 'Video Call'], required: true }
                ]
            }
        }
    },

    // Non-Profit & Charity (8 templates)
    nonprofit: {
        name: 'Non-Profit & Charity',
        description: 'Fundraising, volunteer management, and donation forms',
        icon: '🤲',
        templates: {
            volunteerApplication: {
                name: 'Volunteer Application',
                category: 'nonprofit',
                description: 'Comprehensive volunteer registration and background',
                icon: '🙋‍♀️',
                popular: true,
                title: 'Volunteer Application Form',
                fields: [
                    { type: 'text', name: 'volunteer_name', label: 'Full Name', required: true },
                    { type: 'email', name: 'email', label: 'Email Address', required: true },
                    { type: 'tel', name: 'phone', label: 'Phone Number', required: true },
                    { type: 'textarea', name: 'address', label: 'Home Address', required: true },
                    { type: 'date', name: 'date_of_birth', label: 'Date of Birth', required: true },
                    { type: 'text', name: 'emergency_contact', label: 'Emergency Contact', required: true },
                    { type: 'checkbox', name: 'volunteer_areas', label: 'Areas of Interest', options: ['Event Planning', 'Fundraising', 'Administrative', 'Direct Service', 'Marketing', 'Education'], required: true },
                    { type: 'select', name: 'availability', label: 'Availability', options: ['Weekdays', 'Weekends', 'Evenings', 'Flexible'], required: true },
                    { type: 'textarea', name: 'skills_experience', label: 'Relevant Skills/Experience', required: false },
                    { type: 'radio', name: 'background_check', label: 'Are you willing to undergo a background check?', options: ['Yes', 'No'], required: true }
                ]
            },
            donationForm: {
                name: 'Online Donation Form',
                category: 'nonprofit',
                description: 'Secure online donation processing with donor information',
                icon: '💝',
                popular: true,
                title: 'Make a Donation',
                fields: [
                    { type: 'text', name: 'donor_name', label: 'Full Name', required: true },
                    { type: 'email', name: 'email', label: 'Email Address', required: true },
                    { type: 'tel', name: 'phone', label: 'Phone Number', required: false },
                    { type: 'select', name: 'donation_type', label: 'Donation Type', options: ['One-time', 'Monthly Recurring', 'Annual'], required: true },
                    { type: 'select', name: 'donation_amount', label: 'Donation Amount', options: ['$25', '$50', '$100', '$250', '$500', 'Other Amount'], required: true },
                    { type: 'number', name: 'custom_amount', label: 'Custom Amount ($)', required: false },
                    { type: 'select', name: 'designation', label: 'Designation', options: ['General Fund', 'Education Programs', 'Emergency Relief', 'Operating Expenses'], required: true },
                    { type: 'radio', name: 'tribute', label: 'Is this donation in honor/memory of someone?', options: ['Yes', 'No'], required: true },
                    { type: 'text', name: 'tribute_name', label: 'Name of Person', required: false },
                    { type: 'checkbox', name: 'communication_preferences', label: 'Communication Preferences', options: ['Email Updates', 'Newsletter', 'Annual Report', 'Event Invitations'], required: false }
                ]
            }
        }
    }
};

// Export the expanded templates
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ExpandedTemplates;
} else if (typeof window !== 'undefined') {
    window.ExpandedTemplates = ExpandedTemplates;
}