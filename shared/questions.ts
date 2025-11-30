import type { TriviaQuestion } from "./trivia";

export const questionBank: TriviaQuestion[] = [
  // Unit Trusts - Easy
  {
    id: "ut-e-1",
    question: "What is a unit trust?",
    options: [
      "A type of bank account",
      "A pooled investment fund managed by professionals",
      "A government savings bond",
      "A type of insurance policy"
    ],
    correctAnswer: 1,
    category: "unit_trusts",
    difficulty: "easy",
    explanation: "A unit trust is a pooled investment fund where money from many investors is combined and managed by professional fund managers to invest in various securities."
  },
  {
    id: "ut-e-2",
    question: "Which organization regulates unit trusts in Malaysia?",
    options: [
      "Bank Negara Malaysia",
      "Securities Commission Malaysia",
      "Bursa Malaysia",
      "Ministry of Finance"
    ],
    correctAnswer: 1,
    category: "unit_trusts",
    difficulty: "easy",
    explanation: "The Securities Commission Malaysia (SC) is the regulatory body that oversees and regulates unit trusts and the fund management industry in Malaysia."
  },
  {
    id: "ut-e-3",
    question: "What is NAV in unit trust investment?",
    options: [
      "New Asset Value",
      "Net Annual Variance",
      "Net Asset Value",
      "Nominal Appreciation Value"
    ],
    correctAnswer: 2,
    category: "unit_trusts",
    difficulty: "easy",
    explanation: "NAV (Net Asset Value) represents the per-unit value of a fund, calculated by dividing the total value of assets minus liabilities by the number of units outstanding."
  },
  {
    id: "ut-e-4",
    question: "What is the minimum investment typically required for unit trusts in Malaysia?",
    options: [
      "RM10",
      "RM100",
      "RM1,000",
      "RM10,000"
    ],
    correctAnswer: 2,
    category: "unit_trusts",
    difficulty: "easy",
    explanation: "Most unit trusts in Malaysia require a minimum initial investment of RM1,000, though some may allow lower amounts for regular savings plans."
  },
  {
    id: "ut-e-5",
    question: "What type of unit trust invests primarily in stocks?",
    options: [
      "Money Market Fund",
      "Bond Fund",
      "Equity Fund",
      "Fixed Income Fund"
    ],
    correctAnswer: 2,
    category: "unit_trusts",
    difficulty: "easy",
    explanation: "Equity funds primarily invest in stocks/shares of companies, aiming for capital growth over the long term."
  },
  // Unit Trusts - Medium
  {
    id: "ut-m-1",
    question: "What is the typical sales charge for equity unit trusts in Malaysia?",
    options: [
      "0-1%",
      "3-6%",
      "10-15%",
      "No charges apply"
    ],
    correctAnswer: 1,
    category: "unit_trusts",
    difficulty: "medium",
    explanation: "Equity unit trusts in Malaysia typically charge a sales charge (entry fee) of 3-6% of the investment amount, though some platforms offer discounted rates."
  },
  {
    id: "ut-m-2",
    question: "What is a feeder fund?",
    options: [
      "A fund that only invests in food companies",
      "A fund that invests into another target fund",
      "A fund that provides regular income",
      "A fund managed by multiple managers"
    ],
    correctAnswer: 1,
    category: "unit_trusts",
    difficulty: "medium",
    explanation: "A feeder fund collects money from investors and channels it into a target fund (usually a foreign fund), allowing Malaysian investors to access international investments."
  },
  {
    id: "ut-m-3",
    question: "What does 'switching' mean in unit trust investment?",
    options: [
      "Canceling your investment",
      "Moving investment from one fund to another within the same fund house",
      "Converting units to cash",
      "Changing your fund manager"
    ],
    correctAnswer: 1,
    category: "unit_trusts",
    difficulty: "medium",
    explanation: "Switching refers to transferring your investment from one fund to another within the same fund management company, often with reduced or no switching fees."
  },
  {
    id: "ut-m-4",
    question: "What is the purpose of a fund's expense ratio?",
    options: [
      "To show the fund's past returns",
      "To indicate the annual operating costs as a percentage of assets",
      "To display the entry fees",
      "To show the exit charges"
    ],
    correctAnswer: 1,
    category: "unit_trusts",
    difficulty: "medium",
    explanation: "The expense ratio (or Management Expense Ratio - MER) shows the annual operating costs of managing the fund as a percentage of the fund's average net assets."
  },
  // Unit Trusts - Hard
  {
    id: "ut-h-1",
    question: "Under FIMM guidelines, what is the maximum sales charge for bond/sukuk funds?",
    options: [
      "1%",
      "3%",
      "5%",
      "There is no maximum limit"
    ],
    correctAnswer: 1,
    category: "unit_trusts",
    difficulty: "hard",
    explanation: "The Federation of Investment Managers Malaysia (FIMM) guidelines stipulate a maximum sales charge of 3% for bond and sukuk funds."
  },
  {
    id: "ut-h-2",
    question: "What is the cooling-off period for unit trust investments in Malaysia?",
    options: [
      "3 business days",
      "6 business days",
      "14 calendar days",
      "30 calendar days"
    ],
    correctAnswer: 1,
    category: "unit_trusts",
    difficulty: "hard",
    explanation: "First-time unit trust investors in Malaysia have a 6 business day cooling-off period during which they can cancel their investment and receive a refund at NAV."
  },
  // ASB/ASN - Easy
  {
    id: "asb-e-1",
    question: "What does ASB stand for?",
    options: [
      "Amanah Saham Bank",
      "Amanah Saham Bumiputera",
      "Amanah Simpanan Bersatu",
      "Amanah Saham Berhad"
    ],
    correctAnswer: 1,
    category: "asb_asn",
    difficulty: "easy",
    explanation: "ASB stands for Amanah Saham Bumiputera, a unit trust fund established for Bumiputera investors in Malaysia."
  },
  {
    id: "asb-e-2",
    question: "Who manages ASB and ASN funds?",
    options: [
      "Bank Negara Malaysia",
      "Permodalan Nasional Berhad (PNB)",
      "Employees Provident Fund",
      "Securities Commission"
    ],
    correctAnswer: 1,
    category: "asb_asn",
    difficulty: "easy",
    explanation: "Permodalan Nasional Berhad (PNB) is the fund management company that manages both ASB and ASN funds in Malaysia."
  },
  {
    id: "asb-e-3",
    question: "What is the fixed price per unit for ASB?",
    options: [
      "RM0.50",
      "RM1.00",
      "RM2.00",
      "Price varies daily"
    ],
    correctAnswer: 1,
    category: "asb_asn",
    difficulty: "easy",
    explanation: "ASB has a fixed unit price of RM1.00 per unit, making it easy to calculate investments and returns."
  },
  {
    id: "asb-e-4",
    question: "Is there any sales charge or fee for investing in ASB?",
    options: [
      "Yes, 3% sales charge",
      "Yes, 1% annual management fee",
      "No, there are no charges",
      "Yes, 5% exit fee"
    ],
    correctAnswer: 2,
    category: "asb_asn",
    difficulty: "easy",
    explanation: "ASB does not charge any sales fee, management fee, or redemption fee, making it one of the most cost-effective investment options for eligible investors."
  },
  {
    id: "asb-e-5",
    question: "What is the maximum investment limit for ASB?",
    options: [
      "RM100,000",
      "RM200,000",
      "RM300,000",
      "No limit"
    ],
    correctAnswer: 1,
    category: "asb_asn",
    difficulty: "easy",
    explanation: "The maximum investment limit for ASB is RM200,000 per individual investor."
  },
  // ASB/ASN - Medium
  {
    id: "asb-m-1",
    question: "Can non-Bumiputera investors invest in ASB?",
    options: [
      "Yes, anyone can invest",
      "No, only Bumiputera can invest",
      "Yes, but with higher fees",
      "Yes, through nominees only"
    ],
    correctAnswer: 1,
    category: "asb_asn",
    difficulty: "medium",
    explanation: "ASB is exclusively for Bumiputera investors. Non-Bumiputera can invest in other ASN funds like ASN Equity 3."
  },
  {
    id: "asb-m-2",
    question: "What type of return does ASB typically provide?",
    options: [
      "Fixed interest rate",
      "Variable dividend based on fund performance",
      "Guaranteed capital gains",
      "Monthly income distribution"
    ],
    correctAnswer: 1,
    category: "asb_asn",
    difficulty: "medium",
    explanation: "ASB provides variable dividends based on the fund's annual performance, historically averaging around 5-8% per annum."
  },
  {
    id: "asb-m-3",
    question: "Which ASN fund is open to all Malaysians regardless of race?",
    options: [
      "ASB",
      "ASN Equity 2",
      "ASN Equity 3",
      "ASN Imbang 1"
    ],
    correctAnswer: 2,
    category: "asb_asn",
    difficulty: "medium",
    explanation: "ASN Equity 3 is one of the ASN funds that is open to all Malaysian citizens regardless of their ethnic background."
  },
  // ASB/ASN - Hard
  {
    id: "asb-h-1",
    question: "What is the typical dividend payout month for ASB?",
    options: [
      "January",
      "June",
      "December",
      "March"
    ],
    correctAnswer: 0,
    category: "asb_asn",
    difficulty: "hard",
    explanation: "ASB typically announces and credits dividend payments in January each year, reflecting the previous year's fund performance."
  },
  {
    id: "asb-h-2",
    question: "Can ASB units be used as collateral for financing?",
    options: [
      "No, ASB cannot be used as collateral",
      "Yes, through ASB Financing offered by banks",
      "Only for housing loans",
      "Only for education loans"
    ],
    correctAnswer: 1,
    category: "asb_asn",
    difficulty: "hard",
    explanation: "Many banks offer ASB Financing where investors can use their ASB units as collateral to borrow money to invest more in ASB."
  },
  // EPF - Easy
  {
    id: "epf-e-1",
    question: "What does EPF stand for in Malaysia?",
    options: [
      "Employee Pension Fund",
      "Employees Provident Fund",
      "Employee Protection Fund",
      "Employer's Provident Fund"
    ],
    correctAnswer: 1,
    category: "epf",
    difficulty: "easy",
    explanation: "EPF stands for Employees Provident Fund (also known as KWSP - Kumpulan Wang Simpanan Pekerja), Malaysia's mandatory retirement savings scheme."
  },
  {
    id: "epf-e-2",
    question: "What is the minimum employee contribution rate to EPF?",
    options: [
      "7%",
      "9%",
      "11%",
      "13%"
    ],
    correctAnswer: 2,
    category: "epf",
    difficulty: "easy",
    explanation: "Employees must contribute a minimum of 11% of their monthly salary to EPF (9% for those above 60 years old)."
  },
  {
    id: "epf-e-3",
    question: "What is the standard employer contribution rate to EPF?",
    options: [
      "11%",
      "12%",
      "13%",
      "15%"
    ],
    correctAnswer: 2,
    category: "epf",
    difficulty: "easy",
    explanation: "Employers typically contribute 13% of an employee's monthly salary to EPF (12% for salaries above RM5,000)."
  },
  {
    id: "epf-e-4",
    question: "At what age can you fully withdraw your EPF savings?",
    options: [
      "50 years old",
      "55 years old",
      "60 years old",
      "65 years old"
    ],
    correctAnswer: 1,
    category: "epf",
    difficulty: "easy",
    explanation: "EPF members can make a full withdrawal of their savings upon reaching 55 years of age (retirement age for EPF purposes)."
  },
  {
    id: "epf-e-5",
    question: "How many accounts does EPF savings get divided into?",
    options: [
      "1 account",
      "2 accounts",
      "3 accounts",
      "4 accounts"
    ],
    correctAnswer: 1,
    category: "epf",
    difficulty: "easy",
    explanation: "EPF savings are divided into 2 accounts: Account 1 (70% for retirement) and Account 2 (30% for pre-retirement withdrawals)."
  },
  // EPF - Medium
  {
    id: "epf-m-1",
    question: "What can EPF Account 2 be used for?",
    options: [
      "Retirement only",
      "Housing, education, and healthcare withdrawals",
      "Emergency funds only",
      "Investment in stocks only"
    ],
    correctAnswer: 1,
    category: "epf",
    difficulty: "medium",
    explanation: "EPF Account 2 can be partially withdrawn for specific purposes including housing, education, healthcare, and reaching age 50."
  },
  {
    id: "epf-m-2",
    question: "What is the EPF Members Investment Scheme?",
    options: [
      "A scheme to invest EPF in government bonds",
      "A scheme allowing members to invest part of Account 1 in approved funds",
      "A scheme for employer investments",
      "A scheme for voluntary contributions only"
    ],
    correctAnswer: 1,
    category: "epf",
    difficulty: "medium",
    explanation: "The EPF Members Investment Scheme allows members to invest a portion of their Account 1 savings in approved unit trust and other investment funds."
  },
  {
    id: "epf-m-3",
    question: "What is i-Saraan?",
    options: [
      "An EPF loan scheme",
      "A voluntary contribution scheme for self-employed and informal workers",
      "An emergency withdrawal scheme",
      "An employer contribution scheme"
    ],
    correctAnswer: 1,
    category: "epf",
    difficulty: "medium",
    explanation: "i-Saraan is EPF's voluntary contribution scheme designed for self-employed individuals, freelancers, and those without formal employment to save for retirement."
  },
  // EPF - Hard
  {
    id: "epf-h-1",
    question: "What is the maximum amount eligible for annual tax relief for EPF contributions?",
    options: [
      "RM3,000",
      "RM4,000",
      "RM6,000",
      "RM7,000"
    ],
    correctAnswer: 1,
    category: "epf",
    difficulty: "hard",
    explanation: "EPF contributions (including life insurance premiums) are eligible for tax relief up to RM4,000 per year under Section 49 of the Income Tax Act."
  },
  {
    id: "epf-h-2",
    question: "What percentage of Account 1 can be invested through the Members Investment Scheme?",
    options: [
      "20%",
      "30%",
      "50%",
      "Up to the amount exceeding Basic Savings"
    ],
    correctAnswer: 3,
    category: "epf",
    difficulty: "hard",
    explanation: "Members can invest the amount in Account 1 that exceeds their Basic Savings requirement (which varies by age) through the Members Investment Scheme."
  },
  // Stocks/Bursa - Easy
  {
    id: "stk-e-1",
    question: "What is Bursa Malaysia?",
    options: [
      "Malaysia's central bank",
      "Malaysia's stock exchange",
      "A government investment agency",
      "A securities regulatory body"
    ],
    correctAnswer: 1,
    category: "stocks_bursa",
    difficulty: "easy",
    explanation: "Bursa Malaysia is Malaysia's stock exchange where shares of public listed companies are bought and sold."
  },
  {
    id: "stk-e-2",
    question: "What is the main benchmark index for Bursa Malaysia?",
    options: [
      "KLCI",
      "FBM KLCI",
      "FTSE 100",
      "S&P 500"
    ],
    correctAnswer: 1,
    category: "stocks_bursa",
    difficulty: "easy",
    explanation: "The FTSE Bursa Malaysia KLCI (FBM KLCI) is the main stock market index comprising the 30 largest companies on Bursa Malaysia."
  },
  {
    id: "stk-e-3",
    question: "What is a lot size in Bursa Malaysia?",
    options: [
      "10 shares",
      "50 shares",
      "100 shares",
      "1,000 shares"
    ],
    correctAnswer: 2,
    category: "stocks_bursa",
    difficulty: "easy",
    explanation: "In Bursa Malaysia, one lot equals 100 shares, which is the standard trading unit for stocks."
  },
  {
    id: "stk-e-4",
    question: "What do you need to open to trade stocks in Malaysia?",
    options: [
      "Current account only",
      "CDS account and trading account",
      "Fixed deposit account",
      "EPF account"
    ],
    correctAnswer: 1,
    category: "stocks_bursa",
    difficulty: "easy",
    explanation: "To trade stocks in Malaysia, you need a Central Depository System (CDS) account to hold your shares and a trading account with a stockbroker."
  },
  {
    id: "stk-e-5",
    question: "What are trading hours for Bursa Malaysia?",
    options: [
      "8:00am - 4:00pm",
      "9:00am - 5:00pm",
      "9:00am - 12:30pm and 2:30pm - 5:00pm",
      "10:00am - 6:00pm"
    ],
    correctAnswer: 2,
    category: "stocks_bursa",
    difficulty: "easy",
    explanation: "Bursa Malaysia trading hours are from 9:00am to 12:30pm (morning session) and 2:30pm to 5:00pm (afternoon session), Monday to Friday."
  },
  // Stocks/Bursa - Medium
  {
    id: "stk-m-1",
    question: "What is the ACE Market in Bursa Malaysia?",
    options: [
      "A market for blue-chip stocks",
      "A market for small and emerging companies",
      "A market for foreign companies",
      "A market for government securities"
    ],
    correctAnswer: 1,
    category: "stocks_bursa",
    difficulty: "medium",
    explanation: "The ACE Market is designed for companies with growth potential, typically smaller and emerging businesses, with less stringent listing requirements than the Main Market."
  },
  {
    id: "stk-m-2",
    question: "What is an IPO?",
    options: [
      "Internal Price Offering",
      "Initial Public Offering",
      "Investment Portfolio Order",
      "Indexed Purchase Option"
    ],
    correctAnswer: 1,
    category: "stocks_bursa",
    difficulty: "medium",
    explanation: "An IPO (Initial Public Offering) is when a private company offers shares to the public for the first time through a stock exchange listing."
  },
  {
    id: "stk-m-3",
    question: "What does contra trading mean in Malaysian stock market?",
    options: [
      "Trading against market trends",
      "Buying and selling the same stock within T+2 settlement period",
      "Trading only during market downturns",
      "Trading foreign stocks locally"
    ],
    correctAnswer: 1,
    category: "stocks_bursa",
    difficulty: "medium",
    explanation: "Contra trading allows investors to buy and sell the same stock within the T+2 settlement period without having to pay the full amount upfront."
  },
  {
    id: "stk-m-4",
    question: "What is a dividend in stock investment?",
    options: [
      "A type of stock",
      "A portion of company profits distributed to shareholders",
      "A trading fee",
      "A type of stock split"
    ],
    correctAnswer: 1,
    category: "stocks_bursa",
    difficulty: "medium",
    explanation: "A dividend is a portion of a company's profits that is distributed to its shareholders, usually on a quarterly or annual basis."
  },
  // Stocks/Bursa - Hard
  {
    id: "stk-h-1",
    question: "What is the stamp duty rate for share transactions in Malaysia?",
    options: [
      "0.1% capped at RM200",
      "0.15% capped at RM1,000",
      "0.3% with no cap",
      "0.5% capped at RM500"
    ],
    correctAnswer: 1,
    category: "stocks_bursa",
    difficulty: "hard",
    explanation: "Stamp duty for share transactions in Malaysia is 0.15% of the transaction value, capped at a maximum of RM1,000 per contract."
  },
  {
    id: "stk-h-2",
    question: "What is the clearing fee charged by Bursa Malaysia?",
    options: [
      "0.01%",
      "0.03%",
      "0.05%",
      "0.1%"
    ],
    correctAnswer: 1,
    category: "stocks_bursa",
    difficulty: "hard",
    explanation: "The clearing fee charged by Bursa Malaysia is 0.03% of the transaction value."
  },
  // REITs - Easy
  {
    id: "reit-e-1",
    question: "What does REIT stand for?",
    options: [
      "Real Estate Income Trust",
      "Real Estate Investment Trust",
      "Rental Estate Investment Tracker",
      "Real Equity Investment Trust"
    ],
    correctAnswer: 1,
    category: "reits",
    difficulty: "easy",
    explanation: "REIT stands for Real Estate Investment Trust, a company that owns, operates, or finances income-producing real estate."
  },
  {
    id: "reit-e-2",
    question: "What type of assets do REITs typically invest in?",
    options: [
      "Stocks and bonds",
      "Properties like malls, offices, and hotels",
      "Manufacturing equipment",
      "Technology startups"
    ],
    correctAnswer: 1,
    category: "reits",
    difficulty: "easy",
    explanation: "REITs invest in income-generating real estate properties such as shopping malls, office buildings, hotels, hospitals, and industrial properties."
  },
  {
    id: "reit-e-3",
    question: "How do REIT investors typically earn returns?",
    options: [
      "Only through capital gains",
      "Through regular income distributions from rental income",
      "Only through property appreciation",
      "Through interest payments"
    ],
    correctAnswer: 1,
    category: "reits",
    difficulty: "easy",
    explanation: "REIT investors earn returns primarily through regular income distributions derived from rental income collected from the properties the REIT owns."
  },
  {
    id: "reit-e-4",
    question: "Where are Malaysian REITs traded?",
    options: [
      "Only through fund managers",
      "Bursa Malaysia",
      "Singapore Stock Exchange",
      "They cannot be traded"
    ],
    correctAnswer: 1,
    category: "reits",
    difficulty: "easy",
    explanation: "Malaysian REITs (M-REITs) are listed and traded on Bursa Malaysia, making them accessible to retail investors."
  },
  // REITs - Medium
  {
    id: "reit-m-1",
    question: "What percentage of taxable income must Malaysian REITs distribute to unitholders?",
    options: [
      "At least 50%",
      "At least 70%",
      "At least 90%",
      "100%"
    ],
    correctAnswer: 2,
    category: "reits",
    difficulty: "medium",
    explanation: "Malaysian REITs must distribute at least 90% of their taxable income to unitholders annually to enjoy tax transparency treatment."
  },
  {
    id: "reit-m-2",
    question: "Which of these is a well-known Malaysian REIT?",
    options: [
      "Maybank REIT",
      "KLCC REIT",
      "Genting REIT",
      "TNB REIT"
    ],
    correctAnswer: 1,
    category: "reits",
    difficulty: "medium",
    explanation: "KLCC REIT is one of the prominent Malaysian REITs, owning iconic properties including the PETRONAS Twin Towers retail podium."
  },
  {
    id: "reit-m-3",
    question: "What is an Islamic REIT?",
    options: [
      "A REIT managed by Islamic banks",
      "A REIT that complies with Shariah investment principles",
      "A REIT that only invests in mosques",
      "A REIT for Muslim investors only"
    ],
    correctAnswer: 1,
    category: "reits",
    difficulty: "medium",
    explanation: "An Islamic REIT is a REIT that complies with Shariah investment principles, with restrictions on tenant activities and financing structures."
  },
  // REITs - Hard
  {
    id: "reit-h-1",
    question: "What is the withholding tax rate on REIT distributions for individual Malaysian investors?",
    options: [
      "0%",
      "10%",
      "15%",
      "25%"
    ],
    correctAnswer: 1,
    category: "reits",
    difficulty: "hard",
    explanation: "Malaysian individual investors are subject to a 10% withholding tax on REIT distributions, which is the final tax (no further tax filing required)."
  },
  {
    id: "reit-h-2",
    question: "What is the gearing limit for Malaysian REITs under Securities Commission guidelines?",
    options: [
      "35%",
      "50%",
      "60%",
      "75%"
    ],
    correctAnswer: 1,
    category: "reits",
    difficulty: "hard",
    explanation: "Malaysian REITs have a gearing limit of 50% of their total asset value as per Securities Commission guidelines."
  },
  // Fixed Deposits - Easy
  {
    id: "fd-e-1",
    question: "What is a fixed deposit?",
    options: [
      "A type of stock investment",
      "A savings account with a fixed interest rate for a specific period",
      "A government bond",
      "An insurance product"
    ],
    correctAnswer: 1,
    category: "fixed_deposits",
    difficulty: "easy",
    explanation: "A fixed deposit (FD) is a savings account where you deposit a sum of money for a fixed period at a predetermined interest rate."
  },
  {
    id: "fd-e-2",
    question: "Are fixed deposits in Malaysia protected by any guarantee?",
    options: [
      "No protection available",
      "Protected by PIDM up to RM250,000",
      "Protected by Bank Negara up to RM100,000",
      "Protected by insurance only"
    ],
    correctAnswer: 1,
    category: "fixed_deposits",
    difficulty: "easy",
    explanation: "Fixed deposits in Malaysia are protected by PIDM (Perbadanan Insurans Deposit Malaysia) up to RM250,000 per depositor per member bank."
  },
  {
    id: "fd-e-3",
    question: "What typically happens if you withdraw a fixed deposit before maturity?",
    options: [
      "No penalty applies",
      "You may lose some or all interest earned",
      "You must pay a 10% fine",
      "You cannot withdraw before maturity"
    ],
    correctAnswer: 1,
    category: "fixed_deposits",
    difficulty: "easy",
    explanation: "Early withdrawal of a fixed deposit typically results in a penalty, usually forfeiture of some or all of the interest earned."
  },
  {
    id: "fd-e-4",
    question: "What is the minimum deposit for most fixed deposits in Malaysia?",
    options: [
      "RM100",
      "RM500",
      "RM1,000",
      "RM5,000"
    ],
    correctAnswer: 2,
    category: "fixed_deposits",
    difficulty: "easy",
    explanation: "Most Malaysian banks require a minimum deposit of RM1,000 to open a fixed deposit account, though some may offer lower minimums."
  },
  // Fixed Deposits - Medium
  {
    id: "fd-m-1",
    question: "What is a promotional fixed deposit rate?",
    options: [
      "A permanent higher interest rate",
      "A temporarily higher rate offered by banks for a limited time",
      "A rate for corporate clients only",
      "A government-subsidized rate"
    ],
    correctAnswer: 1,
    category: "fixed_deposits",
    difficulty: "medium",
    explanation: "Promotional FD rates are temporarily higher interest rates offered by banks for a limited period to attract new deposits."
  },
  {
    id: "fd-m-2",
    question: "What is an FD ladder strategy?",
    options: [
      "Investing in multiple banks",
      "Splitting deposits across different tenures for flexibility",
      "Only investing in short-term FDs",
      "Reinvesting all interest earned"
    ],
    correctAnswer: 1,
    category: "fixed_deposits",
    difficulty: "medium",
    explanation: "FD laddering involves splitting your deposits across different maturity periods to balance liquidity needs with earning potential from longer-term rates."
  },
  {
    id: "fd-m-3",
    question: "How is fixed deposit interest typically calculated in Malaysia?",
    options: [
      "Daily compounding",
      "Simple interest",
      "Continuously compounded",
      "Weekly compounding"
    ],
    correctAnswer: 1,
    category: "fixed_deposits",
    difficulty: "medium",
    explanation: "Most fixed deposits in Malaysia use simple interest calculation, where interest is computed based on the principal amount only."
  },
  // Fixed Deposits - Hard
  {
    id: "fd-h-1",
    question: "Is interest from fixed deposits taxable in Malaysia?",
    options: [
      "Yes, at marginal tax rate",
      "No, interest income is tax-exempt for individuals",
      "Only amounts above RM10,000",
      "Yes, at a flat 10% rate"
    ],
    correctAnswer: 1,
    category: "fixed_deposits",
    difficulty: "hard",
    explanation: "Interest income from fixed deposits held by Malaysian individuals is generally tax-exempt, making FDs tax-efficient for savers."
  },
  {
    id: "fd-h-2",
    question: "What is the overnight policy rate (OPR) set by Bank Negara and how does it affect FD rates?",
    options: [
      "It has no effect on FD rates",
      "Higher OPR generally leads to higher FD rates",
      "Higher OPR leads to lower FD rates",
      "OPR only affects loan rates"
    ],
    correctAnswer: 1,
    category: "fixed_deposits",
    difficulty: "hard",
    explanation: "The OPR set by Bank Negara influences FD rates - when OPR increases, banks typically raise their FD rates to attract deposits."
  },
  // Sukuk/Bonds - Easy
  {
    id: "skk-e-1",
    question: "What is a sukuk?",
    options: [
      "A type of stock",
      "An Islamic bond or investment certificate",
      "A savings account",
      "A government tax"
    ],
    correctAnswer: 1,
    category: "sukuk_bonds",
    difficulty: "easy",
    explanation: "Sukuk is an Islamic investment certificate, similar to a bond but structured to comply with Shariah principles, typically backed by tangible assets."
  },
  {
    id: "skk-e-2",
    question: "What is the main difference between conventional bonds and sukuk?",
    options: [
      "Sukuk offers higher returns",
      "Sukuk must comply with Islamic principles and avoid interest",
      "Sukuk are only for Muslim investors",
      "There is no difference"
    ],
    correctAnswer: 1,
    category: "sukuk_bonds",
    difficulty: "easy",
    explanation: "Unlike conventional bonds that pay interest (riba), sukuk must comply with Shariah principles by providing returns through profit-sharing or asset-backed structures."
  },
  {
    id: "skk-e-3",
    question: "What are Malaysian Government Securities (MGS)?",
    options: [
      "Stocks issued by the government",
      "Bonds issued by the Malaysian government",
      "Insurance policies",
      "Foreign exchange instruments"
    ],
    correctAnswer: 1,
    category: "sukuk_bonds",
    difficulty: "easy",
    explanation: "Malaysian Government Securities (MGS) are bonds issued by the Malaysian government to raise funds, considered among the safest investments in Malaysia."
  },
  {
    id: "skk-e-4",
    question: "What is a corporate bond?",
    options: [
      "A stock in a corporation",
      "A debt instrument issued by a company to raise capital",
      "An employee benefit program",
      "A type of mutual fund"
    ],
    correctAnswer: 1,
    category: "sukuk_bonds",
    difficulty: "easy",
    explanation: "A corporate bond is a debt security issued by a company to borrow money from investors, who receive regular interest payments and principal repayment at maturity."
  },
  // Sukuk/Bonds - Medium
  {
    id: "skk-m-1",
    question: "What does bond yield mean?",
    options: [
      "The face value of the bond",
      "The return on investment expressed as a percentage",
      "The bond's maturity date",
      "The bond's credit rating"
    ],
    correctAnswer: 1,
    category: "sukuk_bonds",
    difficulty: "medium",
    explanation: "Bond yield is the return on investment earned from a bond, typically expressed as an annual percentage based on the bond's price and coupon payments."
  },
  {
    id: "skk-m-2",
    question: "What is a bond's coupon rate?",
    options: [
      "The discount offered when buying the bond",
      "The fixed annual interest rate paid on the bond's face value",
      "The fee charged by bond brokers",
      "The inflation adjustment rate"
    ],
    correctAnswer: 1,
    category: "sukuk_bonds",
    difficulty: "medium",
    explanation: "The coupon rate is the fixed annual interest rate that the bond issuer agrees to pay bondholders, calculated as a percentage of the bond's face value."
  },
  {
    id: "skk-m-3",
    question: "What happens to bond prices when interest rates rise?",
    options: [
      "Bond prices increase",
      "Bond prices decrease",
      "Bond prices stay the same",
      "Only affects new bonds"
    ],
    correctAnswer: 1,
    category: "sukuk_bonds",
    difficulty: "medium",
    explanation: "Bond prices and interest rates have an inverse relationship - when interest rates rise, existing bond prices typically fall to remain competitive."
  },
  // Sukuk/Bonds - Hard
  {
    id: "skk-h-1",
    question: "What is the most common type of sukuk structure in Malaysia?",
    options: [
      "Sukuk Murabahah",
      "Sukuk Ijarah",
      "Sukuk Musharakah",
      "Sukuk Wakalah"
    ],
    correctAnswer: 0,
    category: "sukuk_bonds",
    difficulty: "hard",
    explanation: "Sukuk Murabahah is one of the most common sukuk structures in Malaysia, based on cost-plus financing where the issuer sells assets and buys them back at a markup."
  },
  {
    id: "skk-h-2",
    question: "What is the minimum investment for retail bonds through BIDS (Bond and Sukuk Information Dissemination System)?",
    options: [
      "RM100",
      "RM1,000",
      "RM10,000",
      "RM100,000"
    ],
    correctAnswer: 1,
    category: "sukuk_bonds",
    difficulty: "hard",
    explanation: "Through the BIDS platform, retail investors can access government bonds and sukuk with a minimum investment of RM1,000."
  },
  // PRS - Easy
  {
    id: "prs-e-1",
    question: "What is PRS in Malaysia?",
    options: [
      "Public Retirement Scheme",
      "Private Retirement Scheme",
      "Personal Retirement Savings",
      "Provident Retirement System"
    ],
    correctAnswer: 1,
    category: "prs",
    difficulty: "easy",
    explanation: "PRS stands for Private Retirement Scheme, a voluntary retirement savings scheme designed to supplement EPF savings for Malaysians."
  },
  {
    id: "prs-e-2",
    question: "Is PRS mandatory for Malaysian workers?",
    options: [
      "Yes, for all workers",
      "No, it is a voluntary scheme",
      "Only for private sector workers",
      "Only for self-employed individuals"
    ],
    correctAnswer: 1,
    category: "prs",
    difficulty: "easy",
    explanation: "PRS is a voluntary retirement savings scheme - participation is not mandatory unlike EPF for employed individuals."
  },
  {
    id: "prs-e-3",
    question: "Who can invest in PRS?",
    options: [
      "Only Malaysian citizens",
      "Only employees with EPF",
      "Any Malaysian or permanent resident aged 18 and above",
      "Only high-income individuals"
    ],
    correctAnswer: 2,
    category: "prs",
    difficulty: "easy",
    explanation: "PRS is open to any Malaysian citizen or permanent resident aged 18 years and above, including the self-employed."
  },
  {
    id: "prs-e-4",
    question: "What is the minimum contribution to PRS?",
    options: [
      "RM10",
      "RM50",
      "RM100",
      "RM500"
    ],
    correctAnswer: 2,
    category: "prs",
    difficulty: "easy",
    explanation: "The minimum contribution to most PRS funds is RM100, making it accessible to a wide range of investors."
  },
  // PRS - Medium
  {
    id: "prs-m-1",
    question: "What is the tax relief available for PRS contributions?",
    options: [
      "RM1,000",
      "RM3,000",
      "RM5,000",
      "RM7,000"
    ],
    correctAnswer: 1,
    category: "prs",
    difficulty: "medium",
    explanation: "PRS contributions qualify for a separate tax relief of up to RM3,000 per year, in addition to EPF/life insurance relief."
  },
  {
    id: "prs-m-2",
    question: "Into how many sub-accounts are PRS contributions divided?",
    options: [
      "1 account",
      "2 accounts (Sub-account A and Sub-account B)",
      "3 accounts",
      "4 accounts"
    ],
    correctAnswer: 1,
    category: "prs",
    difficulty: "medium",
    explanation: "PRS contributions are divided into Sub-account A (70% for retirement) and Sub-account B (30% available for pre-retirement withdrawal)."
  },
  {
    id: "prs-m-3",
    question: "What type of funds are available under PRS?",
    options: [
      "Only equity funds",
      "Only fixed income funds",
      "Growth, moderate, and conservative funds based on risk profiles",
      "Only Shariah-compliant funds"
    ],
    correctAnswer: 2,
    category: "prs",
    difficulty: "medium",
    explanation: "PRS offers various fund options including growth, moderate, and conservative funds to suit different investor risk appetites, including default lifecycle options."
  },
  // PRS - Hard
  {
    id: "prs-h-1",
    question: "What is the penalty for early withdrawal from PRS Sub-account B?",
    options: [
      "No penalty",
      "8% tax penalty on the withdrawal amount",
      "10% tax penalty on the withdrawal amount",
      "15% tax penalty on the withdrawal amount"
    ],
    correctAnswer: 1,
    category: "prs",
    difficulty: "hard",
    explanation: "Pre-retirement withdrawals from PRS Sub-account B are subject to an 8% tax penalty on the amount withdrawn."
  },
  {
    id: "prs-h-2",
    question: "At what age can you make a full withdrawal from PRS without penalty?",
    options: [
      "50 years old",
      "55 years old",
      "60 years old",
      "65 years old"
    ],
    correctAnswer: 1,
    category: "prs",
    difficulty: "hard",
    explanation: "PRS members can make a full withdrawal of their savings without penalty upon reaching the retirement age of 55 years."
  },
  {
    id: "prs-h-3",
    question: "What is the PRS Youth Incentive?",
    options: [
      "A scholarship program",
      "A one-time RM500 government incentive for youth aged 18-30",
      "Free PRS enrollment for students",
      "Reduced management fees for young investors"
    ],
    correctAnswer: 1,
    category: "prs",
    difficulty: "hard",
    explanation: "The PRS Youth Incentive was a government initiative providing a one-time RM500 contribution to eligible Malaysians aged 20-30 who contributed to PRS."
  },
  // Additional questions to reach 100+
  {
    id: "ut-m-5",
    question: "What is dollar-cost averaging in unit trust investment?",
    options: [
      "Investing only in US dollar funds",
      "Regular fixed investments regardless of market conditions",
      "Converting ringgit to dollars for investment",
      "Investing based on exchange rates"
    ],
    correctAnswer: 1,
    category: "unit_trusts",
    difficulty: "medium",
    explanation: "Dollar-cost averaging involves investing a fixed amount regularly regardless of market conditions, averaging out the purchase price over time."
  },
  {
    id: "epf-m-4",
    question: "What is i-Invest under EPF?",
    options: [
      "A new EPF account type",
      "An online platform to invest EPF savings in unit trusts",
      "A loan scheme from EPF",
      "An insurance product from EPF"
    ],
    correctAnswer: 1,
    category: "epf",
    difficulty: "medium",
    explanation: "i-Invest is EPF's online platform that allows members to invest their Account 1 savings in approved unit trust funds directly."
  },
  {
    id: "stk-m-5",
    question: "What is a penny stock?",
    options: [
      "A stock that costs one cent",
      "A low-priced stock typically trading below RM1",
      "A stock from a penny arcade company",
      "A stock for small investors only"
    ],
    correctAnswer: 1,
    category: "stocks_bursa",
    difficulty: "medium",
    explanation: "Penny stocks are typically low-priced stocks trading below RM1 per share, often from smaller companies with higher risk and volatility."
  },
  {
    id: "reit-m-4",
    question: "What is the management fee structure for most Malaysian REITs?",
    options: [
      "Fixed annual fee only",
      "Base fee plus performance fee based on property income",
      "No management fees",
      "One-time entry fee only"
    ],
    correctAnswer: 1,
    category: "reits",
    difficulty: "medium",
    explanation: "Malaysian REITs typically charge a combination of a base management fee and performance fees tied to the REIT's property income or distributions."
  },
  {
    id: "fd-m-4",
    question: "What is an e-fixed deposit?",
    options: [
      "A fixed deposit in foreign currency",
      "A fixed deposit opened and managed online",
      "An emergency fixed deposit",
      "A fixed deposit with enhanced returns"
    ],
    correctAnswer: 1,
    category: "fixed_deposits",
    difficulty: "medium",
    explanation: "An e-fixed deposit is a fixed deposit that can be opened and managed entirely online, often offering slightly higher interest rates than branch-based FDs."
  },
  {
    id: "skk-m-4",
    question: "What is credit rating for bonds?",
    options: [
      "The bond's market price",
      "An assessment of the issuer's ability to repay debt",
      "The bond's maturity period",
      "The bond's coupon rate"
    ],
    correctAnswer: 1,
    category: "sukuk_bonds",
    difficulty: "medium",
    explanation: "A credit rating is an assessment by rating agencies of the bond issuer's creditworthiness and ability to repay debt, helping investors gauge default risk."
  },
  {
    id: "prs-m-4",
    question: "What is a default option in PRS?",
    options: [
      "An option when you fail to pay",
      "An automatic age-based fund allocation for members who don't choose",
      "The minimum contribution amount",
      "An emergency withdrawal option"
    ],
    correctAnswer: 1,
    category: "prs",
    difficulty: "medium",
    explanation: "The default option in PRS is a lifecycle fund that automatically adjusts asset allocation based on the member's age if they don't actively select funds."
  },
  {
    id: "asb-m-4",
    question: "What is the ASB2 fund?",
    options: [
      "A second type of ASB for non-Bumiputera",
      "An extension of ASB allowing additional investment beyond RM200,000",
      "A short-term ASB fund",
      "An ASB fund for minors only"
    ],
    correctAnswer: 1,
    category: "asb_asn",
    difficulty: "medium",
    explanation: "ASB2 allows Bumiputera investors to invest additional amounts beyond the RM200,000 limit in ASB, also at RM1 per unit with no sales charge."
  },
  {
    id: "ut-h-3",
    question: "What is a wholesale fund in Malaysia?",
    options: [
      "A fund for wholesale businesses",
      "A fund for sophisticated investors with minimum RM500,000 investment",
      "A fund that invests in wholesale companies",
      "A fund sold in bulk quantities"
    ],
    correctAnswer: 1,
    category: "unit_trusts",
    difficulty: "hard",
    explanation: "Wholesale funds in Malaysia are designed for sophisticated investors and typically require a minimum investment of RM500,000, with less regulatory requirements."
  },
  {
    id: "stk-h-3",
    question: "What is the Securities Commission's regulation on short selling in Malaysia?",
    options: [
      "Short selling is completely banned",
      "Regulated Short Selling (RSS) is allowed for approved securities",
      "Short selling is unrestricted",
      "Only for institutional investors"
    ],
    correctAnswer: 1,
    category: "stocks_bursa",
    difficulty: "hard",
    explanation: "Regulated Short Selling (RSS) is permitted in Malaysia for approved securities under Securities Commission guidelines, with specific rules and borrowing requirements."
  },
  {
    id: "epf-h-3",
    question: "What is the EPF Simpanan Shariah account?",
    options: [
      "A separate EPF for Islamic banking employees",
      "An option to have EPF savings invested according to Shariah principles",
      "A higher-return EPF account",
      "An EPF account for non-Malaysians"
    ],
    correctAnswer: 1,
    category: "epf",
    difficulty: "hard",
    explanation: "Simpanan Shariah is an EPF option allowing members to have their savings invested in Shariah-compliant investments while maintaining the same contribution structure."
  },
  {
    id: "reit-h-3",
    question: "What is NAV per unit in REITs context?",
    options: [
      "The rental income per unit",
      "The net asset value of the REIT divided by total units",
      "The annual distribution amount",
      "The purchase price of units"
    ],
    correctAnswer: 1,
    category: "reits",
    difficulty: "hard",
    explanation: "NAV per unit represents the net asset value of the REIT's properties (assets minus liabilities) divided by the total number of units outstanding."
  },
  {
    id: "fd-h-3",
    question: "What is a negotiable instrument of deposit (NID)?",
    options: [
      "A regular fixed deposit",
      "A tradeable fixed deposit certificate for large amounts",
      "A foreign currency deposit",
      "An online deposit certificate"
    ],
    correctAnswer: 1,
    category: "fixed_deposits",
    difficulty: "hard",
    explanation: "A NID is a large-denomination time deposit (typically RM100,000+) that can be traded in the secondary market before maturity."
  },
  {
    id: "skk-h-3",
    question: "What is a perpetual sukuk?",
    options: [
      "A sukuk with no maturity date",
      "A sukuk that must be renewed annually",
      "A sukuk only for government",
      "A sukuk with fixed 30-year tenure"
    ],
    correctAnswer: 0,
    category: "sukuk_bonds",
    difficulty: "hard",
    explanation: "A perpetual sukuk has no fixed maturity date, meaning the issuer has no obligation to redeem the principal, though they typically include call options."
  },
  {
    id: "asb-h-3",
    question: "What is the penalty for withdrawing from ASB Financing before loan completion?",
    options: [
      "No penalty applies",
      "Early settlement penalty as per loan agreement",
      "Forfeiture of all dividends",
      "Cannot withdraw until loan is fully paid"
    ],
    correctAnswer: 1,
    category: "asb_asn",
    difficulty: "hard",
    explanation: "ASB Financing loans typically include early settlement penalties as specified in the loan agreement, varying by bank and loan terms."
  }
];
