# 🏥 Kuala Insurance Claim Portal


## 📦 How to Run the Project Locally

## ⚙️ Prerequisites

Before you begin, ensure you have met the following requirements:

| Requirement  | Version  | Installation Guide |
|-------------|----------|--------------------|
| Git         | Latest   | [Git Install Guide](https://git-scm.com/) |
| Python      | 3.8+     | [Python Downloads](https://www.python.org/downloads/) |
| Node.js     | 18+      | [Node.js Downloads](https://nodejs.org/) |
| npm         | 9+       | Comes with Node.js |

---

## 🚀 Getting Started



```bash
# Clone the repository
git clone https://github.com/stwala/kuala-insurance.git
cd kuala-insurance

# Create and activate virtual environment
python -m venv env
source env/bin/activate  # On Windows: .\env\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up database
python manage.py makemigrations
python manage.py migrate

# Create admin user
python manage.py createsuperuser

# Run development server
python manage.py runserver :


### 💻 Frontend Setup (Vite + React)
# Navigate to the frontend directory:

cd ../insurance-frontend
npm install
npm run dev

🧠 Development Decisions

  - Django was chosen for its intuitive structure and powerful built-in admin dashboard, which simplifies database and user management.

  - Vite + React was selected for the frontend due to its speed, lightweight nature, and support for modern JavaScript features.

  - Postman was used throughout the development process to test and verify backend API functionality.

  - Serializers were used for validation of data.

🔮 Future Improvements

If given more time, the system could be improved with:

    🧾 User onboarding & authentication

    📊 Frontend dashboard for users to view claim history and profile data

    🤖 AI-based form validation for insurance claim submissions

    📧 Fully functional email notifications (logic is implemented but needs full integration; emails currently work via Python shell)

    🧠 Claim prioritization algorithm to handle claims based on urgency or type

    🧪 Unit and integration tests

    🚀 Production deployment setup with Docker and CI/CD

🙋‍♂️ Author
Developed by 3ng Sitwala.
Feel free to reach out for questions, feedback, or collaboration!
    
