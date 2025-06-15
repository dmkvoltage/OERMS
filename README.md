# OERMS - Online Examination and Results Management System

## Backend
A comprehensive backend system for managing examinations and results in Cameroon's education sector, built with FastAPI and PostgreSQL.

## 🚀 Features

### Core Functionality
- **Student Management**: Registration, profile management, and academic tracking
- **Institution Management**: School registration, admin assignment, and verification
- **Examination Management**: Exam creation, registration, and scheduling
- **Results Management**: Result entry, publication, and verification
- **User Authentication**: JWT-based authentication with role-based access control
- **Notification System**: Real-time notifications for students and administrators
- **File Management**: Document upload and management for certificates and transcripts

### Administrative Features
- **Ministry Admin Dashboard**: System-wide oversight and management
- **Institutional Admin Panel**: School-level administration
- **Public Access Portal**: Result verification and search functionality
- **Analytics & Reporting**: Performance metrics and statistical analysis
- **Audit Logging**: Complete system activity tracking

### Technical Features
- **RESTful API**: Comprehensive REST API with OpenAPI documentation
- **Database Optimization**: Advanced indexing and query optimization
- **Security**: Role-based access control, data encryption, and audit trails
- **Scalability**: Designed for high-volume concurrent usage
- **Data Archiving**: Automated data archiving and backup strategies

## 🛠️ Technology Stack

- **Backend Framework**: FastAPI 0.104.1
- **Database**: PostgreSQL 15+ with advanced features
- **Authentication**: JWT with bcrypt password hashing
- **ORM**: SQLAlchemy 2.0 with Alembic migrations
- **Caching**: Redis for session management and caching
- **File Storage**: Local storage with support for cloud storage
- **Documentation**: Auto-generated OpenAPI/Swagger documentation
- **Testing**: Pytest with comprehensive test coverage
- **Deployment**: Docker containerization with multi-stage builds

## 📋 Prerequisites

- Python 3.11+
- PostgreSQL 15+
- Redis 7+ (optional, for caching)
- Git

## 🚀 Quick Start

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/yourusername/oerms-backend.git
cd oerms-backend
\`\`\`

### 2. Set Up Virtual Environment

\`\`\`bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate
\`\`\`

### 3. Install Dependencies

\`\`\`bash
pip install -r requirements.txt
\`\`\`

### 4. Environment Configuration

Create a \`.env\` file in the root directory:

\`\`\`env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/oerms

# Security
SECRET_KEY=your-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Application Settings
DEBUG=True
PROJECT_NAME=OERMS
VERSION=1.0.0

# CORS Settings
ALLOWED_HOSTS=localhost,127.0.0.1,*.vercel.app

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Redis Configuration (Optional)
REDIS_URL=redis://localhost:6379
\`\`\`

### 5. Database Setup

\`\`\`bash
# Create database
createdb oerms

# Run database migrations
python run_scripts.py scripts/01_create_database_schema.sql
python run_scripts.py scripts/02_seed_initial_data.sql

# Apply additional optimizations
python run_complete_fix_v2.py
\`\`\`

### 6. Run the Application

\`\`\`bash
# Development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Production server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
\`\`\`

The API will be available at:
- **API**: http://localhost:8000
- **Documentation**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

\`\`\`bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
\`\`\`

### Using Docker Only

\`\`\`bash
# Build the image
docker build -t oerms-backend .

# Run the container
docker run -d \\
  --name oerms-api \\
  -p 8000:8000 \\
  -e DATABASE_URL=your-database-url \\
  -e SECRET_KEY=your-secret-key \\
  oerms-backend
\`\`\`

## 🌐 Deployment on Render

### Step 1: Prepare Your Repository

1. Ensure your code is pushed to GitHub/GitLab
2. Make sure all environment variables are documented
3. Verify the \`requirements.txt\` is up to date

### Step 2: Create a Render Account

1. Go to [render.com](https://render.com)
2. Sign up with your GitHub/GitLab account
3. Connect your repository

### Step 3: Create a PostgreSQL Database

1. In Render Dashboard, click "New +"
2. Select "PostgreSQL"
3. Configure:
   - **Name**: \`oerms-database\`
   - **Database**: \`oerms\`
   - **User**: \`oerms_user\`
   - **Region**: Choose closest to your users
   - **Plan**: Free tier for development, paid for production

4. Note the connection details provided

### Step 4: Create a Redis Instance (Optional)

1. Click "New +" → "Redis"
2. Configure:
   - **Name**: \`oerms-redis\`
   - **Region**: Same as database
   - **Plan**: Free tier available

### Step 5: Deploy the Web Service

1. Click "New +" → "Web Service"
2. Connect your repository
3. Configure:

\`\`\`yaml
# Basic Settings
Name: oerms-backend
Region: [Same as database]
Branch: main
Runtime: Python 3

# Build & Deploy
Build Command: pip install -r requirements.txt
Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT

# Environment Variables
DATABASE_URL: [Use internal connection string from Step 3]
SECRET_KEY: [Generate a secure random key]
DEBUG: False
ALLOWED_HOSTS: *.onrender.com
\`\`\`

### Step 6: Environment Variables

Add these environment variables in Render:

\`\`\`
DATABASE_URL=postgresql://oerms_user:password@hostname:5432/oerms
SECRET_KEY=your-super-secure-secret-key-here
DEBUG=False
PROJECT_NAME=OERMS
VERSION=1.0.0
ALLOWED_HOSTS=*.onrender.com,yourdomain.com
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
\`\`\`

### Step 7: Database Initialization

After deployment, initialize your database:

1. Use Render's shell access or connect via psql
2. Run the initialization scripts:

\`\`\`bash
# Connect to your deployed service shell
python run_scripts.py scripts/01_create_database_schema.sql
python run_scripts.py scripts/02_seed_initial_data.sql
python run_complete_fix_v2.py
\`\`\`

### Step 8: Custom Domain (Optional)

1. In your service settings, go to "Custom Domains"
2. Add your domain (e.g., \`api.yourdomain.com\`)
3. Configure DNS records as instructed
4. Update \`ALLOWED_HOSTS\` environment variable

## 📚 API Documentation

### Authentication Endpoints

\`\`\`
POST /api/v1/auth/login          # User login
POST /api/v1/auth/register       # User registration
POST /api/v1/auth/refresh        # Refresh access token
POST /api/v1/auth/logout         # User logout
\`\`\`

### Student Endpoints

\`\`\`
GET  /api/v1/students/           # List students
POST /api/v1/students/           # Create student
GET  /api/v1/students/{id}       # Get student details
PUT  /api/v1/students/{id}       # Update student
DELETE /api/v1/students/{id}     # Delete student
\`\`\`

### Examination Endpoints

\`\`\`
GET  /api/v1/exams/              # List exams
POST /api/v1/exams/              # Create exam
GET  /api/v1/exams/{id}          # Get exam details
PUT  /api/v1/exams/{id}          # Update exam
POST /api/v1/exams/{id}/register # Register for exam
\`\`\`

### Results Endpoints

\`\`\`
GET  /api/v1/results/            # List results
POST /api/v1/results/            # Create result
GET  /api/v1/results/{id}        # Get result details
PUT  /api/v1/results/{id}        # Update result
POST /api/v1/results/publish     # Publish results
\`\`\`

### Public Endpoints

\`\`\`
GET  /api/v1/public/search       # Search results
GET  /api/v1/public/verify       # Verify certificate
GET  /api/v1/public/stats        # Public statistics
\`\`\`

For complete API documentation, visit \`/docs\` when the server is running.

## 🧪 Testing

### Run All Tests

\`\`\`bash
# Run unit tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_auth.py

# Run comprehensive database tests
python comprehensive_test_suite_fixed.py
\`\`\`

### Test Categories

- **Unit Tests**: Individual function and method testing
- **Integration Tests**: API endpoint testing
- **Database Tests**: Data integrity and performance testing
- **Authentication Tests**: Security and access control testing
- **Functional Tests**: End-to-end workflow testing

## 📊 Database Schema

### Core Tables

- **student**: Student information and profiles
- **institution**: Educational institutions
- **exam**: Examination definitions
- **exam_registration**: Student exam registrations
- **results**: Examination results
- **notifications**: System notifications
- **audit_logs**: System activity logging

### Administrative Tables

- **ministry_admin**: Ministry-level administrators
- **institutional_admin**: School-level administrators
- **exam_body**: Examination boards and bodies
- **system_analytics**: System usage analytics

### Archive Tables

- **archive.student**: Archived student records
- **archive.results**: Archived results
- **archive.notifications**: Archived notifications

## 🔧 Configuration

### Database Configuration

The system supports advanced PostgreSQL features:

- **Indexing**: Optimized indexes for performance
- **Partitioning**: Table partitioning for large datasets
- **Full-text Search**: Advanced search capabilities
- **JSON Support**: JSONB for flexible data storage
- **Audit Logging**: Complete activity tracking

### Security Configuration

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **CORS**: Configurable cross-origin resource sharing
- **Rate Limiting**: API rate limiting (configurable)
- **Input Validation**: Comprehensive input sanitization

### Performance Configuration

- **Connection Pooling**: Database connection optimization
- **Caching**: Redis-based caching layer
- **Query Optimization**: Optimized database queries
- **Async Processing**: Asynchronous request handling

## 🚨 Troubleshooting

### Common Issues

#### Database Connection Issues

\`\`\`bash
# Check database connectivity
python -c "import psycopg2; print('PostgreSQL connection OK')"

# Verify database exists
psql -h hostname -U username -d oerms -c "SELECT version();"
\`\`\`

#### Migration Issues

\`\`\`bash
# Reset database (development only)
python run_scripts.py scripts/01_create_database_schema.sql

# Check current schema
python check_database.py
\`\`\`

#### Performance Issues

\`\`\`bash
# Run performance analysis
python comprehensive_test_suite_fixed.py

# Check database statistics
psql -d oerms -c "SELECT * FROM pg_stat_user_tables;"
\`\`\`

### Logs and Monitoring

- **Application Logs**: Check \`uvicorn\` output
- **Database Logs**: PostgreSQL logs for query analysis
- **Error Tracking**: Structured logging with timestamps
- **Performance Metrics**: Built-in analytics and monitoring

## 🤝 Contributing

### Development Setup

1. Fork the repository
2. Create a feature branch: \`git checkout -b feature-name\`
3. Make your changes
4. Run tests: \`pytest\`
5. Commit changes: \`git commit -am 'Add feature'\`
6. Push to branch: \`git push origin feature-name\`
7. Submit a Pull Request

### Code Standards

- **Python**: Follow PEP 8 style guidelines
- **SQL**: Use consistent formatting and naming
- **Documentation**: Update README and API docs
- **Testing**: Maintain test coverage above 80%

### Commit Message Format

\`\`\`
type(scope): description

feat(auth): add JWT refresh token functionality
fix(database): resolve connection pool exhaustion
docs(readme): update deployment instructions
test(api): add integration tests for results endpoint
\`\`\`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- FastAPI framework for excellent async support
- PostgreSQL for robust database capabilities
- Render for reliable hosting platform
- The open-source community for various tools and libraries

## 📞 Support

For support and questions:

- **Email**: support@oerms.com
- **Documentation**: [API Docs](https://your-app.onrender.com/docs)
- **Issues**: [GitHub Issues](https://github.com/yourusername/oerms-backend/issues)

## 🗺️ Roadmap

### Version 1.1
- [ ] Real-time notifications with WebSocket
- [ ] Advanced analytics dashboard
- [ ] Mobile app API enhancements
- [ ] Bulk data import/export

### Version 1.2
- [ ] Multi-language support
- [ ] Advanced reporting system
- [ ] Integration with external systems
- [ ] Enhanced security features

### Version 2.0
- [ ] Microservices architecture
- [ ] GraphQL API support
- [ ] Machine learning integration
- [ ] Advanced data analytics

---
## Frontend

# OERMS - Online Examination and Results Management System

A comprehensive web application for managing examinations and results in Cameroon's education sector, built with Next.js frontend and FastAPI backend.

## 🎯 Overview

OERMS is designed to streamline the examination process for educational institutions in Cameroon, providing a centralized platform for:

- **Student Registration** - Online exam registration and document submission
- **Institution Management** - School and university administration
- **Ministry Oversight** - Government-level examination control
- **Results Publication** - Secure and timely result dissemination
- **Document Generation** - Automated certificates and transcripts

## 🏗️ Architecture

### Frontend (Next.js 15)
- **Framework**: Next.js with App Router
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React Context + Custom hooks
- **Authentication**: JWT-based with role-based access control
- **Real-time**: Socket.io integration
- **Database**: Supabase (PostgreSQL)

### Backend (FastAPI)
- **Framework**: FastAPI with Python 3.10+
- **Database**: SQLAlchemy ORM with PostgreSQL/SQLite
- **Authentication**: JWT tokens with refresh mechanism
- **Security**: RBAC, input validation, SQL injection protection
- **Performance**: Query optimization, indexing strategies
- **Monitoring**: Comprehensive logging and audit trails

## 🚀 Features

### 👨‍🎓 Student Features
- Online exam registration
- Document upload and verification
- Real-time result checking
- Certificate and transcript download
- Notification system

### 🏫 Institution Admin Features
- Student enrollment management
- Institution profile management
- Local result oversight
- Batch document generation
- Analytics and reporting

### 🏛️ Ministry Admin Features
- Exam creation and management
- Institution verification
- System-wide analytics
- User management
- Data backup and recovery

### 🔒 Security Features
- Role-based access control (RBAC)
- JWT authentication with refresh tokens
- Input validation and sanitization
- SQL injection protection
- Comprehensive audit logging
- Data encryption

## 📋 Prerequisites

### System Requirements
- **Node.js**: 18.0 or higher
- **Python**: 3.10 or higher
- **Database**: PostgreSQL 13+ (or SQLite for development)
- **Memory**: 4GB RAM minimum
- **Storage**: 10GB available space

### Development Tools
- Git
- npm or yarn
- pip (Python package manager)
- Code editor (VS Code recommended)

## 🛠️ Installation

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/your-username/oerms.git
cd oerms
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
python -m alembic upgrade head

# Start the backend server
python -m app.main
\`\`\`

### 3. Frontend Setup
\`\`\`bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run database setup scripts (if using Supabase)
npm run setup:db

# Start the development server
npm run dev
\`\`\`

## 🔧 Configuration

### Backend Environment Variables (.env)
\`\`\`env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/oerms

# Security
SECRET_KEY=your-super-secret-key-change-this-in-production
JWT_SECRET=your-jwt-secret-key

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# File Upload
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760  # 10MB
\`\`\`

### Frontend Environment Variables (.env.local)
\`\`\`env
# API Configuration
NEXT_PUBLIC_FASTAPI_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase (if using)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Real-time Features
NEXT_PUBLIC_SOCKET_URL=http://localhost:8000
\`\`\`

## 🗄️ Database Setup

### Using PostgreSQL (Recommended for Production)
\`\`\`bash
# Create database
createdb oerms

# Update DATABASE_URL in .env
DATABASE_URL=postgresql://username:password@localhost:5432/oerms
\`\`\`

### Using Supabase (Cloud PostgreSQL)
1. Create a new project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key
3. Run the SQL scripts in `frontend/scripts/` in order:
   - `01-create-tables.sql`
   - `02-create-policies.sql`
   - `03-seed-data.sql`
   - `04-setup-auth.sql`
   - `05-create-template-tables.sql`

## 🚀 Deployment

### Backend Deployment (Railway/Heroku)
\`\`\`bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
\`\`\`

### Frontend Deployment (Vercel)
\`\`\`bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
\`\`\`

### Environment Variables for Production
Make sure to set all environment variables in your deployment platform:
- Database connection strings
- JWT secrets
- Email configuration
- File upload settings

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Key API Endpoints

#### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/refresh` - Refresh JWT token
- `POST /auth/logout` - User logout

#### Students
- `GET /students/profile` - Get student profile
- `PUT /students/profile` - Update student profile
- `POST /students/register-exam` - Register for exam

#### Exams
- `GET /exams` - List available exams
- `POST /exams` - Create new exam (admin only)
- `GET /exams/{id}` - Get exam details

#### Results
- `GET /results/student/{id}` - Get student results
- `POST /results/publish` - Publish results (admin only)

## 🧪 Testing

### Backend Tests
\`\`\`bash
cd backend
pytest tests/ -v
\`\`\`

### Frontend Tests
\`\`\`bash
cd frontend
npm run test
\`\`\`

### End-to-End Tests
\`\`\`bash
npm run test:e2e
\`\`\`

## 📊 Monitoring and Analytics

### Performance Monitoring
- Query performance tracking
- Slow query detection
- Database statistics
- User activity monitoring

### Logging
- Application logs: `backend/logs/app.log`
- Error logs: `backend/logs/error.log`
- Audit logs: `backend/logs/audit.log`

## 🔐 Security Considerations

### Authentication & Authorization
- JWT tokens with short expiration
- Refresh token rotation
- Role-based access control
- Permission-based operations

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF protection
- Data encryption at rest

### Best Practices
- Regular security audits
- Dependency updates
- Environment variable protection
- Secure file uploads
- Rate limiting

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- **Python**: Follow PEP 8
- **TypeScript**: Use ESLint and Prettier
- **Commits**: Use conventional commit messages
- **Testing**: Write tests for new features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Project Lead**: [Your Name]
- **Backend Developer**: [Backend Dev Name]
- **Frontend Developer**: [Frontend Dev Name]
- **UI/UX Designer**: [Designer Name]

## 📞 Support

For support and questions:
- **Email**: support@oerms.cm
- **Documentation**: [docs.oerms.cm](https://docs.oerms.cm)
- **Issues**: [GitHub Issues](https://github.com/your-username/oerms/issues)

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Basic authentication system
- ✅ Student registration
- ✅ Exam management
- ✅ Results publication

### Phase 2 (Next)
- 🔄 Mobile application
- 🔄 Advanced analytics
- 🔄 Multi-language support
- 🔄 SMS notifications

### Phase 3 (Future)
- 📋 AI-powered fraud detection
- 📋 Blockchain certificates
- 📋 Advanced reporting
- 📋 Integration with other systems

## 🙏 Acknowledgments

- Ministry of Secondary Education, Cameroon
- Educational institutions across Cameroon
- Open source community
- All contributors and testers

