# Kshirva - System Diagrams

## 1. Component (CO) Diagram

```mermaid
graph TB
    subgraph Frontend["Frontend (React.js)"]
        UI[UI Components]
        Pages[Pages]
        Context[Auth Context]
        Services[API Services]
    end

    subgraph Backend["Backend (Node.js / Express)"]
        Server[server.js]
        Routes[Routes]
        Controllers[Controllers]
        Middleware[Middleware\nAuth / Rate Limit]
        Utils[Utils\nEmail / SMS]
    end

    subgraph Database["Database (MongoDB)"]
        UserModel[User Model]
        ProductModel[Product Model]
        OrderModel[Order Model]
        ReviewModel[Review Model]
    end

    subgraph External["External Services"]
        Cloudinary[Cloudinary\nImage Storage]
        Razorpay[Razorpay\nPayments]
        Twilio[Twilio\nSMS]
        Nodemailer[Nodemailer\nEmail]
        GoogleMaps[Google Maps\nLocation]
    end

    UI --> Pages
    Pages --> Context
    Pages --> Services
    Services -->|HTTP / REST API| Server
    Server --> Routes
    Routes --> Middleware
    Middleware --> Controllers
    Controllers --> UserModel
    Controllers --> ProductModel
    Controllers --> OrderModel
    Controllers --> ReviewModel
    Controllers --> Cloudinary
    Controllers --> Razorpay
    Controllers --> Twilio
    Controllers --> Nodemailer
    Pages --> GoogleMaps
```

---

## 2. Workflow Diagram

```mermaid
flowchart TD
    A([User Visits Kshirva]) --> B{Registered?}
    B -- No --> C[Register\nConsumer / Farmer]
    C --> D[OTP Verification]
    D --> E[Account Created]
    B -- Yes --> F[Login]
    E --> F

    F --> G{User Role}

    G -- Consumer --> H[Browse Products]
    H --> I[Add to Cart]
    I --> J[Checkout & Payment\nRazorpay]
    J --> K[Order Placed]
    K --> L[Farmer Notified]
    L --> M[Order Packed & Dispatched]
    M --> N[Real-time Tracking]
    N --> O[Order Delivered]
    O --> P[Consumer Reviews Farmer]

    G -- Farmer --> Q[Create / Manage Products]
    Q --> R[Receive Order Notification]
    R --> S[Accept / Reject Order]
    S --> T[Update Order Status]
    T --> U[Earnings Updated]

    G -- Admin --> V[Review Farmer Applications]
    V --> W[Approve / Reject Farmer]
    W --> X[Monitor Orders & Users]
    X --> Y[Manage Commission]
```

---

## 3. Flowchart — Order Placement

```mermaid
flowchart TD
    Start([Start]) --> Login[Consumer Logs In]
    Login --> Browse[Browse Products by Location]
    Browse --> Select[Select Product]
    Select --> Stock{In Stock?}
    Stock -- No --> Browse
    Stock -- Yes --> Cart[Add to Cart]
    Cart --> More{Add More?}
    More -- Yes --> Browse
    More -- No --> Checkout[Proceed to Checkout]
    Checkout --> Address[Enter Delivery Address]
    Address --> Payment[Choose Payment Method]
    Payment --> Gateway[Razorpay Payment Gateway]
    Gateway --> Success{Payment\nSuccessful?}
    Success -- No --> Retry[Retry / Cancel]
    Retry --> Payment
    Success -- Yes --> Order[Order Created in DB]
    Order --> NotifyFarmer[Notify Farmer via SMS / Email]
    NotifyFarmer --> FarmerAction{Farmer\nAccepts?}
    FarmerAction -- No --> Refund[Initiate Refund]
    Refund --> End1([End])
    FarmerAction -- Yes --> Pack[Pack & Dispatch]
    Pack --> Track[Real-time Order Tracking]
    Track --> Deliver[Delivered to Consumer]
    Deliver --> Review[Consumer Leaves Review]
    Review --> End2([End])
```

---

## 4. Data Flow Diagram (DFD)

### Level 0 — Context Diagram

```mermaid
flowchart LR
    Consumer([Consumer]) -->|Browse, Order, Pay| System[Kshirva Platform]
    Farmer([Farmer]) -->|List Products, Manage Orders| System
    Admin([Admin]) -->|Verify, Monitor, Manage| System
    System -->|Order Updates, Notifications| Consumer
    System -->|Order Alerts, Earnings| Farmer
    System -->|Reports, Analytics| Admin
    System <-->|Images| Cloudinary([Cloudinary])
    System <-->|Payments| Razorpay([Razorpay])
    System <-->|SMS| Twilio([Twilio])
```

### Level 1 — Detailed DFD

```mermaid
flowchart TD
    Consumer([Consumer])
    Farmer([Farmer])
    Admin([Admin])

    subgraph P1["P1: Authentication"]
        Register[Register / Login]
        OTP[OTP Verify]
        JWT[Issue JWT Token]
    end

    subgraph P2["P2: Product Management"]
        AddProduct[Add / Update Product]
        FetchProducts[Fetch Products]
        FilterProducts[Filter by Location / Category]
    end

    subgraph P3["P3: Order Processing"]
        PlaceOrder[Place Order]
        UpdateStatus[Update Order Status]
        TrackOrder[Track Order]
    end

    subgraph P4["P4: Payment"]
        InitPayment[Initiate Payment]
        VerifyPayment[Verify Payment]
        Refund[Process Refund]
    end

    subgraph P5["P5: Notifications"]
        EmailNotify[Send Email]
        SMSNotify[Send SMS]
    end

    subgraph DS["Data Stores"]
        UserDB[(Users DB)]
        ProductDB[(Products DB)]
        OrderDB[(Orders DB)]
    end

    Consumer -->|Credentials| Register
    Register --> JWT
    JWT -->|Token| Consumer

    Farmer -->|Product Data| AddProduct
    AddProduct --> ProductDB
    Consumer -->|Search Query| FetchProducts
    FetchProducts --> FilterProducts
    FilterProducts -->|Product List| Consumer

    Consumer -->|Order Details| PlaceOrder
    PlaceOrder --> OrderDB
    PlaceOrder --> InitPayment
    InitPayment --> VerifyPayment
    VerifyPayment -->|Confirmation| Consumer
    Farmer -->|Status Update| UpdateStatus
    UpdateStatus --> OrderDB
    Consumer -->|Order ID| TrackOrder
    TrackOrder -->|Status| Consumer

    PlaceOrder --> EmailNotify
    PlaceOrder --> SMSNotify
    EmailNotify -->|Email| Farmer
    SMSNotify -->|SMS| Farmer

    Admin -->|Approval| UserDB
    OrderDB -->|Reports| Admin
```
