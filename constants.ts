import { Scenario, Team } from './types';

// Simple beep sounds encoded as Data URIs
export const SOUNDS = {
  CORRECT: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVElo+Nf2tqaXmVl4t8bGttekI+QKywqJN/d3Z9jIyGfXNycX9CPkCssKiTf3d2fYyMhn1zcnF/Qj5ArLCok393dn2MjIZ9c3Jxf0I+QKywqJN/d3Z9jIyGfXNycX8=',
  WRONG: 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAAAAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIA=', 
  WIN: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVElo+Nf2tqaXmVl4t8bGttekI+QKywqJN/d3Z9jIyGfXNycX9CPkCssKiTf3d2fYyMhn1zcnF/Qj5ArLCok393dn2MjIZ9c3Jxf0I+QKywqJN/d3Z9jIyGfXNycX8=' 
};

export const MAX_ROUNDS = 5; 

// Initial Team State
export const INITIAL_KPIs = { revenue: 100, innovation: 50, risk: 10 };

export const SCENARIOS: Scenario[] = [
  // --- UNIT 1: FOUNDATIONS ---
  {
    id: 'foundations-1',
    unit: 'Foundations',
    title: 'Operational Bottle-neck',
    iconType: 'system',
    prompt: 'Your manual order processing system is overwhelmed. Customers are complaining about slow service. You have budget for one major upgrade.',
    options: [
      { 
        id: 'opt1', 
        text: 'Implement a Transaction Processing System (TPS) to automate checkout.', 
        impact: { revenue: 30, innovation: 5, risk: -5 }, 
        feedback: 'Efficient choice. The TPS sped up transactions by 400%, immediately boosting revenue. Basic, but essential.' 
      },
      { 
        id: 'opt2', 
        text: 'Hire more staff to process orders manually.', 
        impact: { revenue: -10, innovation: 0, risk: 10 }, 
        feedback: 'Poor choice. Labor costs skyrocketed and human error increased. You solved the volume problem but destroyed your margins.' 
      },
      { 
        id: 'opt3', 
        text: 'Invest in an experimental AI predicting what customers might buy.', 
        impact: { revenue: 5, innovation: 40, risk: 20 }, 
        feedback: 'Too early. You have a cool AI, but you still cannot process the actual orders fast enough. Strategy misalignment.' 
      }
    ]
  },
  {
    id: 'foundations-2',
    unit: 'Foundations',
    title: 'Executive Vision',
    iconType: 'strategy',
    prompt: 'The CEO feels "blind" regarding global operations. She demands a tool to help her see the big picture without reading 500 spreadsheets.',
    options: [
      { 
        id: 'opt1', 
        text: 'Build a Digital Dashboard (EIS) with drill-down capabilities.', 
        impact: { revenue: 15, innovation: 20, risk: -10 }, 
        feedback: 'Excellent. The CEO spotted a failing region immediately and fixed it. Strategic agility improved.' 
      },
      { 
        id: 'opt2', 
        text: 'Send her weekly summary PDFs via email.', 
        impact: { revenue: 0, innovation: -5, risk: 5 }, 
        feedback: 'Status Quo. The data is stale by the time she reads it. Competitors are reacting faster than you.' 
      },
      { 
        id: 'opt3', 
        text: 'Give the CEO direct access to the raw SQL database.', 
        impact: { revenue: -5, innovation: 10, risk: 40 }, 
        feedback: 'Dangerous. She accidentally deleted a production table while trying to run a query. System downtime: 4 hours.' 
      }
    ]
  },
  {
    id: 'foundations-3',
    unit: 'Foundations',
    title: 'Automation Anxiety',
    iconType: 'system',
    prompt: 'A new chatbot technology can replace 30% of your call center. Employee morale is plummeting due to rumors of layoffs.',
    options: [
      { 
        id: 'opt1', 
        text: 'Fully automate immediately to maximize profit.', 
        impact: { revenue: 40, innovation: 15, risk: 35 }, 
        feedback: 'Short-term gain, long-term pain. Profits spiked, but service quality dropped and remaining staff went on strike.' 
      },
      { 
        id: 'opt2', 
        text: 'Implement a Hybrid Model: AI assists human agents.', 
        impact: { revenue: 20, innovation: 25, risk: -5 }, 
        feedback: 'Balanced approach. Agents are faster and happier. Customer satisfaction reached an all-time high.' 
      },
      { 
        id: 'opt3', 
        text: 'Publicly reject the technology to save jobs.', 
        impact: { revenue: -15, innovation: -10, risk: 5 }, 
        feedback: 'Noble but unsustainable. Competitors used the tech to lower prices, and you lost market share.' 
      }
    ]
  },
  {
    id: 'foundations-4',
    unit: 'Foundations',
    title: 'Green Computing',
    iconType: 'strategy',
    prompt: 'Your data centers are consuming massive amounts of electricity, hurting your "Sustainability Goals" and costing millions.',
    options: [
      { 
        id: 'opt1', 
        text: 'Migrate non-critical workloads to the Public Cloud.', 
        impact: { revenue: 25, innovation: 15, risk: 5 }, 
        feedback: 'Scalable and Efficient. You pay only for what you use, reducing energy waste and capital expenses.' 
      },
      { 
        id: 'opt2', 
        text: 'Buy Carbon Offsets without changing operations.', 
        impact: { revenue: -5, innovation: 0, risk: 0 }, 
        feedback: 'Greenwashing. You look better on paper, but your operational inefficiencies remain unchanged.' 
      },
      { 
        id: 'opt3', 
        text: 'Build a proprietary hydroelectric dam.', 
        impact: { revenue: -50, innovation: 30, risk: 20 }, 
        feedback: 'Overkill. You are a retail company, not an energy provider. The project is years behind schedule.' 
      }
    ]
  },

  // --- UNIT 2: STRATEGY ---
  {
    id: 'strategy-1',
    unit: 'Strategy',
    title: 'Competitive Pressure',
    iconType: 'strategy',
    prompt: 'A rival is undercutting your prices. Your margins are thin. You need a strategic response to survive.',
    options: [
      { 
        id: 'opt1', 
        text: 'Business Process Improvement (BPI): Streamline existing workflows.', 
        impact: { revenue: 20, innovation: 5, risk: 0 }, 
        feedback: 'Safe bet. You cut waste and improved incremental efficiency. You remain competitive, though not dominant.' 
      },
      { 
        id: 'opt2', 
        text: 'Business Process Reengineering (BPR): Completely redesign how you work.', 
        impact: { revenue: 40, innovation: 30, risk: 25 }, 
        feedback: 'High Risk, High Reward. The transition was painful and expensive, but now you operate at half the cost of your rival.' 
      },
      { 
        id: 'opt3', 
        text: 'Ignore them and focus on "Customer Intimacy" marketing.', 
        impact: { revenue: 10, innovation: 15, risk: 5 }, 
        feedback: 'Niche focus. You lost mass market share but retained loyal VIPs. A valid, but smaller, strategy.' 
      }
    ]
  },
  {
    id: 'strategy-2',
    unit: 'Strategy',
    title: 'The New Entrant',
    iconType: 'strategy',
    prompt: 'A "Born Digital" startup has entered your market with no physical stores and a slick app.',
    options: [
      { 
        id: 'opt1', 
        text: 'Acquire them immediately.', 
        impact: { revenue: -20, innovation: 35, risk: 10 }, 
        feedback: 'Aggressive Move. It cost a fortune, but you bought their technology and eliminated the threat.' 
      },
      { 
        id: 'opt2', 
        text: 'Become a "Fast Follower" and copy their app features.', 
        impact: { revenue: 10, innovation: 10, risk: 5 }, 
        feedback: 'Sensible. You kept your customer base, but you are still seen as the "old" brand.' 
      },
      { 
        id: 'opt3', 
        text: 'Sue them for patent infringement.', 
        impact: { revenue: -10, innovation: -5, risk: 30 }, 
        feedback: 'Distraction. You spent millions on lawyers while they spent millions on better software. You lost.' 
      }
    ]
  },
  {
    id: 'strategy-3',
    unit: 'Strategy',
    title: 'Shadow IT',
    iconType: 'system',
    prompt: 'Your Marketing VP bought a cloud software tool without telling IT. It works great, but it is not secure.',
    options: [
      { 
        id: 'opt1', 
        text: 'Block the tool and discipline the VP.', 
        impact: { revenue: -5, innovation: -20, risk: -10 }, 
        feedback: 'Stifling. You secured the network, but marketing is furious and innovation has stalled.' 
      },
      { 
        id: 'opt2', 
        text: 'Integrate the tool officially and secure it.', 
        impact: { revenue: 5, innovation: 15, risk: 5 }, 
        feedback: 'Alignment. You recognized the business need and made it safe. Best of both worlds.' 
      },
      { 
        id: 'opt3', 
        text: 'Ignore it. If it works, it works.', 
        impact: { revenue: 10, innovation: 10, risk: 50 }, 
        feedback: 'Ticking Bomb. The tool leaked customer emails next month. Huge GDPR fine.' 
      }
    ]
  },
  {
    id: 'strategy-4',
    unit: 'Strategy',
    title: 'Click-and-Mortar',
    iconType: 'strategy',
    prompt: 'We are a traditional brick-and-mortar retailer. Online sales are eating our lunch.',
    options: [
      { 
        id: 'opt1', 
        text: 'Launch a full Omni-channel E-commerce strategy.', 
        impact: { revenue: 30, innovation: 25, risk: 15 }, 
        feedback: 'Transformation. Customers can now buy online and pick up in-store. Revenue is diversified.' 
      },
      { 
        id: 'opt2', 
        text: 'Sell strictly on Amazon Marketplace.', 
        impact: { revenue: 15, innovation: 5, risk: 5 }, 
        feedback: 'Low margin. You get sales, but you own no customer data and pay high fees.' 
      },
      { 
        id: 'opt3', 
        text: 'Double down on "In-Store Experience" only.', 
        impact: { revenue: -10, innovation: 5, risk: 35 }, 
        feedback: 'Obsolescence. The experience is great, but foot traffic continues to decline.' 
      }
    ]
  },

  // --- UNIT 3: DATA ---
  {
    id: 'data-1',
    unit: 'Data',
    title: 'The Data Silo Crisis',
    iconType: 'database',
    prompt: 'Marketing has one customer list. Sales has another. Finance has a third. Customers are getting billed for items they returned.',
    options: [
      { 
        id: 'opt1', 
        text: 'Implement an ERP system to centralize all data.', 
        impact: { revenue: 25, innovation: 15, risk: 10 }, 
        feedback: 'Integration Success. It was expensive to install, but now the organization acts as a single cohesive unit.' 
      },
      { 
        id: 'opt2', 
        text: 'Build a Data Warehouse for analysis only.', 
        impact: { revenue: 10, innovation: 25, risk: 0 }, 
        feedback: 'Good for insights, bad for operations. You know WHY customers are angry, but you still haven\'t fixed the billing errors.' 
      },
      { 
        id: 'opt3', 
        text: 'Let departments manage their own "best of breed" software.', 
        impact: { revenue: -10, innovation: 5, risk: 20 }, 
        feedback: 'Fragmentation. The data inconsistencies grew worse. You just lost a major account due to a billing error.' 
      }
    ]
  },
  {
    id: 'data-2',
    unit: 'Data',
    title: 'Knowledge Drain',
    iconType: 'database',
    prompt: 'Your senior engineers are retiring, taking 30 years of "Tacit Knowledge" (experience/intuition) out the door.',
    options: [
      { 
        id: 'opt1', 
        text: 'Create a Knowledge Management System (KMS) and incentivize documentation.', 
        impact: { revenue: 5, innovation: 30, risk: -15 }, 
        feedback: 'Smart. You captured critical troubleshooting guides. New hires are ramping up 50% faster.' 
      },
      { 
        id: 'opt2', 
        text: 'Record video exit interviews.', 
        impact: { revenue: 0, innovation: 5, risk: -5 }, 
        feedback: 'Better than nothing, but searching through 50 hours of video to find one answer is inefficient.' 
      },
      { 
        id: 'opt3', 
        text: 'Hire cheaper fresh graduates to replace them.', 
        impact: { revenue: 10, innovation: -10, risk: 30 }, 
        feedback: 'Short-term gain, long-term loss. The new team made critical mistakes that the seniors would have avoided.' 
      }
    ]
  },
  {
    id: 'data-3',
    unit: 'Data',
    title: 'Big Data Noise',
    iconType: 'database',
    prompt: 'We have terabytes of social media data (Big Data), but no one knows what it means. Sales are slumping.',
    options: [
      { 
        id: 'opt1', 
        text: 'Invest in Predictive Analytics tools.', 
        impact: { revenue: 20, innovation: 40, risk: 5 }, 
        feedback: 'Insightful. You discovered customers hate your new packaging. You changed it, and sales recovered.' 
      },
      { 
        id: 'opt2', 
        text: 'Task interns with reading random tweets.', 
        impact: { revenue: -5, innovation: 0, risk: 0 }, 
        feedback: 'Ineffective. Humans cannot process the "Velocity" and "Volume" of Big Data manually.' 
      },
      { 
        id: 'opt3', 
        text: 'Ignore social media, it is just noise.', 
        impact: { revenue: -15, innovation: -10, risk: 20 }, 
        feedback: 'Blindness. A viral boycott campaign started against you, and you didn\'t notice until it was too late.' 
      }
    ]
  },
  {
    id: 'data-4',
    unit: 'Data',
    title: 'Dirty Data',
    iconType: 'database',
    prompt: 'Our mail campaigns are failing because 20% of addresses in our database are duplicates or incorrect.',
    options: [
      { 
        id: 'opt1', 
        text: 'Launch a Master Data Management (MDM) initiative.', 
        impact: { revenue: 15, innovation: 10, risk: -10 }, 
        feedback: 'Clean Start. It was tedious work, but now every marketing dollar spent actually reaches a real person.' 
      },
      { 
        id: 'opt2', 
        text: 'Switch to email marketing only.', 
        impact: { revenue: 5, innovation: 5, risk: 5 }, 
        feedback: 'Sidestep. You avoided the address problem, but your email list is just as dirty as your physical one.' 
      },
      { 
        id: 'opt3', 
        text: 'Send mail twice to be safe.', 
        impact: { revenue: -20, innovation: -5, risk: 0 }, 
        feedback: 'Wasteful. You just doubled your printing costs to annoy your customers.' 
      }
    ]
  },
  {
    id: 'data-5',
    unit: 'Data',
    title: 'Ransomware Attack',
    iconType: 'database',
    prompt: 'CRITICAL: A hacker has encrypted your Finance Database. They demand 50 Bitcoin to unlock it.',
    options: [
      { 
        id: 'opt1', 
        text: 'Pay the ransom.', 
        impact: { revenue: -40, innovation: 0, risk: 30 }, 
        feedback: 'Risky. They unlocked it this time, but now you are known as a company that pays. They will be back.' 
      },
      { 
        id: 'opt2', 
        text: 'Restore from offline backups (lose 1 day of data).', 
        impact: { revenue: -10, innovation: 5, risk: -20 }, 
        feedback: 'Resilient. You lost a day of work, but you saved millions and proved your disaster recovery plan works.' 
      },
      { 
        id: 'opt3', 
        text: 'Try to crack the encryption yourself.', 
        impact: { revenue: -20, innovation: 10, risk: 50 }, 
        feedback: 'Foolish. Weeks passed, you failed, and the data is now permanently lost.' 
      }
    ]
  },

  // --- UNIT 4: MOBILE & IoT ---
  {
    id: 'mobile-1',
    unit: 'Mobile/IoT',
    title: 'The Field Force',
    iconType: 'mobile',
    prompt: 'Your 500 repair technicians still use paper forms. Data entry takes 2 days, delaying billing and inventory updates.',
    options: [
      { 
        id: 'opt1', 
        text: 'Deploy ruggedized tablets with real-time sync apps.', 
        impact: { revenue: 35, innovation: 20, risk: 5 }, 
        feedback: 'Digital Transformation. Billing is now instant. Inventory is accurate. Cash flow improved dramatically.' 
      },
      { 
        id: 'opt2', 
        text: 'Allow Bring Your Own Device (BYOD) with no security policy.', 
        impact: { revenue: 20, innovation: 10, risk: 50 }, 
        feedback: 'Security Nightmare. You saved hardware costs, but a lost phone exposed all your customer data. Huge fine.' 
      },
      { 
        id: 'opt3', 
        text: 'Keep paper but hire data entry clerks.', 
        impact: { revenue: -5, innovation: -10, risk: 0 }, 
        feedback: 'Backward move. You added salary costs without adding any process speed.' 
      }
    ]
  },
  {
    id: 'iot-1',
    unit: 'Mobile/IoT',
    title: 'Supply Chain Visibility',
    iconType: 'mobile',
    prompt: 'We manufacture expensive engines. Clients want to know exactly when they arrive and if they were damaged in transit.',
    options: [
      { 
        id: 'opt1', 
        text: 'Embed IoT sensors (GPS + Shock detection) in packaging.', 
        impact: { revenue: 15, innovation: 35, risk: 5 }, 
        feedback: 'Premium Service. Clients pay extra for this transparency. You also reduced insurance claims by proving who damaged the goods.' 
      },
      { 
        id: 'opt2', 
        text: 'Use simple barcodes.', 
        impact: { revenue: 5, innovation: 0, risk: 0 }, 
        feedback: 'Standard. It works for tracking location at checkpoints, but offers no data on condition/damage.' 
      },
      { 
        id: 'opt3', 
        text: 'Connect the sensors to the open internet without encryption.', 
        impact: { revenue: 10, innovation: 35, risk: 60 }, 
        feedback: 'Hacked. Hackers located your high-value shipment and hijacked the truck. Total loss.' 
      }
    ]
  },
  {
    id: 'mobile-2',
    unit: 'Mobile/IoT',
    title: 'Location-Based Marketing',
    iconType: 'mobile',
    prompt: 'Foot traffic is down. People walk past your store but do not enter.',
    options: [
      { 
        id: 'opt1', 
        text: 'Use Geofencing to push coupons when customers are near.', 
        impact: { revenue: 25, innovation: 20, risk: 10 }, 
        feedback: 'Effective. "L-Commerce" drove a 20% increase in walk-ins. Some found it creepy, but most liked the discount.' 
      },
      { 
        id: 'opt2', 
        text: 'Put a QR code in the window.', 
        impact: { revenue: 5, innovation: 5, risk: 0 }, 
        feedback: 'Passive. A few people scanned it, but it didn\'t actively pull anyone into the store.' 
      },
      { 
        id: 'opt3', 
        text: 'Buy an email list from a sketchy broker.', 
        impact: { revenue: -5, innovation: 0, risk: 25 }, 
        feedback: 'Spam. You ended up in everyone\'s junk folder and hurt your brand reputation.' 
      }
    ]
  },
  {
    id: 'iot-2',
    unit: 'Mobile/IoT',
    title: 'Remote Patient Monitoring',
    iconType: 'mobile',
    prompt: 'Your healthcare division is struggling with readmission rates. Chronic patients get sick again right after leaving.',
    options: [
      { 
        id: 'opt1', 
        text: 'Issue wearable IoT devices to monitor vitals at home.', 
        impact: { revenue: 30, innovation: 40, risk: 15 }, 
        feedback: 'Proactive. Doctors intervened before emergencies happened. Lives saved, costs cut. Privacy is a concern to manage.' 
      },
      { 
        id: 'opt2', 
        text: 'Require patients to call a nurse daily.', 
        impact: { revenue: -10, innovation: 0, risk: 5 }, 
        feedback: 'Unreliable. Patients forgot to call or lied about their symptoms. Readmission rates remained high.' 
      },
      { 
        id: 'opt3', 
        text: 'Wait for them to come back to the ER.', 
        impact: { revenue: 10, innovation: -10, risk: 40 }, 
        feedback: 'The "Fee for Service" model. You made money on the ER visit, but the insurance company is now fining you for poor outcomes.' 
      }
    ]
  },
  {
    id: 'mobile-3',
    unit: 'Mobile/IoT',
    title: '5G Rollout',
    iconType: 'mobile',
    prompt: 'We are developing autonomous delivery drones. 4G latency is too high, causing crashes.',
    options: [
      { 
        id: 'opt1', 
        text: 'Partner with a Telco to test private 5G networks.', 
        impact: { revenue: -10, innovation: 45, risk: 10 }, 
        feedback: 'Cutting Edge. The investment is heavy, but the near-zero latency makes your drones the safest in the market.' 
      },
      { 
        id: 'opt2', 
        text: 'Use Wi-Fi hotspots around the city.', 
        impact: { revenue: 0, innovation: 5, risk: 30 }, 
        feedback: 'Unstable. The drones keep disconnecting between hotspots. One crashed into a fountain.' 
      },
      { 
        id: 'opt3', 
        text: 'Switch to pre-programmed flight paths (no remote control).', 
        impact: { revenue: 10, innovation: -5, risk: 20 }, 
        feedback: 'Rigid. It works fine until a bird hits a drone and it cannot react. Flexibility is zero.' 
      }
    ]
  },
  
  // --- ADDITIONAL MIXED TOPICS ---
  {
    id: 'society-1',
    unit: 'Foundations',
    title: 'Telecommuting Demand',
    iconType: 'system',
    prompt: 'Top talent is refusing to join your company because you mandate 5 days in the office.',
    options: [
      { 
        id: 'opt1', 
        text: 'Invest in secure VPNs and collaboration tools for WFH.', 
        impact: { revenue: 10, innovation: 20, risk: 10 }, 
        feedback: 'Talent Magnet. You attracted the best developers. Productivity rose, though culture took some effort to maintain.' 
      },
      { 
        id: 'opt2', 
        text: 'Offer higher salaries but keep the office mandate.', 
        impact: { revenue: -20, innovation: 0, risk: 0 }, 
        feedback: 'Expensive. You filled the seats, but your payroll costs blew up the budget.' 
      },
      { 
        id: 'opt3', 
        text: 'Outsource everything to an overseas vendor.', 
        impact: { revenue: 15, innovation: -10, risk: 25 }, 
        feedback: 'Quality Control issues. You saved money, but the time zone difference is causing massive communication delays.' 
      }
    ]
  },
  {
    id: 'security-1',
    unit: 'Data',
    title: 'The Phishing Test',
    iconType: 'system',
    prompt: 'An internal audit reveals 40% of your employees click on suspicious email links.',
    options: [
      { 
        id: 'opt1', 
        text: 'Mandate gamified security awareness training.', 
        impact: { revenue: -5, innovation: 5, risk: -20 }, 
        feedback: 'Culture Shift. Employees are now your first line of defense. Click rates dropped to 2%.' 
      },
      { 
        id: 'opt2', 
        text: 'Block all emails with external links.', 
        impact: { revenue: -25, innovation: -10, risk: -30 }, 
        feedback: 'Draconian. You are safe from phishing, but nobody can do their job. Clients are annoyed.' 
      },
      { 
        id: 'opt3', 
        text: 'Fire anyone who clicks a link.', 
        impact: { revenue: -10, innovation: -20, risk: 10 }, 
        feedback: 'Fear Culture. People are too scared to open legitimate invoices. Business has ground to a halt.' 
      }
    ]
  },
  {
    id: 'strategy-5',
    unit: 'Strategy',
    title: 'Legacy Anchors',
    iconType: 'system',
    prompt: 'Our core banking system runs on 40-year-old COBOL code. The only guy who knows how to fix it is 80 years old.',
    options: [
      { 
        id: 'opt1', 
        text: 'Launch a multi-year modernization project to the Cloud.', 
        impact: { revenue: -30, innovation: 30, risk: 20 }, 
        feedback: 'Painful but Necessary. The migration is eating profits now, but you are future-proofing the bank.' 
      },
      { 
        id: 'opt2', 
        text: 'Pay the 80-year-old a massive retainer.', 
        impact: { revenue: -5, innovation: -10, risk: 50 }, 
        feedback: 'Kicking the Can. You survived this year, but what happens when he actually retires? The risk is existential.' 
      },
      { 
        id: 'opt3', 
        text: 'Build a pretty web interface on top of the old code.', 
        impact: { revenue: 10, innovation: 10, risk: 30 }, 
        feedback: 'Lipstick on a Pig. The app looks nice, but the backend is still slow and crashes on weekends.' 
      }
    ]
  },
  {
    id: 'iot-3',
    unit: 'Mobile/IoT',
    title: 'Smart Office Sensors',
    iconType: 'mobile',
    prompt: 'You want to install desk-occupancy sensors to reduce real estate costs.',
    options: [
      { 
        id: 'opt1', 
        text: 'Install anonymous thermal sensors.', 
        impact: { revenue: 15, innovation: 10, risk: 0 }, 
        feedback: 'Optimized. You cut 2 floors of rent by identifying unused space without violating privacy.' 
      },
      { 
        id: 'opt2', 
        text: 'Put cameras under every desk.', 
        impact: { revenue: 10, innovation: 5, risk: 60 }, 
        feedback: 'Mutiny. The staff felt spied on. A lawsuit for workplace surveillance is pending.' 
      },
      { 
        id: 'opt3', 
        text: 'Ask managers to walk around with a clipboard.', 
        impact: { revenue: -5, innovation: -5, risk: 0 }, 
        feedback: 'Manual & Slow. The data was anecdotal and inaccurate. You cut the wrong office space.' 
      }
    ]
  },
  {
    id: 'data-6',
    unit: 'Data',
    title: 'Blockchain Hype',
    iconType: 'database',
    prompt: 'The CEO read about Blockchain in a magazine and wants to use it for our simple employee directory.',
    options: [
      { 
        id: 'opt1', 
        text: 'Explain that a standard SQL database is faster and cheaper.', 
        impact: { revenue: 10, innovation: 0, risk: -5 }, 
        feedback: 'Rationality. You saved the company $500k by avoiding unnecessary tech hype.' 
      },
      { 
        id: 'opt2', 
        text: 'Build it on Blockchain anyway to please him.', 
        impact: { revenue: -20, innovation: 10, risk: 10 }, 
        feedback: 'Resume Driven Development. It is slow, expensive, and you cannot edit typos easily. But the CEO is happy?' 
      },
      { 
        id: 'opt3', 
        text: 'Use Blockchain for Supply Chain transparency instead.', 
        impact: { revenue: 5, innovation: 30, risk: 5 }, 
        feedback: 'Pivot. You redirected the enthusiasm to a valid use case. Clients love the transparency.' 
      }
    ]
  },
  {
    id: 'strategy-6',
    unit: 'Strategy',
    title: 'Vendor Lock-in',
    iconType: 'strategy',
    prompt: 'Your cloud provider just raised prices by 40%. You are 100% dependent on their proprietary tools.',
    options: [
      { 
        id: 'opt1', 
        text: 'Pay the increase and cut costs elsewhere.', 
        impact: { revenue: -15, innovation: 0, risk: 0 }, 
        feedback: 'Hostage. You are bleeding money, but operations are stable. You have no leverage.' 
      },
      { 
        id: 'opt2', 
        text: 'Refactor code to be "Cloud Agnostic" (Containers).', 
        impact: { revenue: -20, innovation: 25, risk: 10 }, 
        feedback: 'Strategic Freedom. It costs money now, but next year you can move workloads to the cheapest provider instantly.' 
      },
      { 
        id: 'opt3', 
        text: 'Sue the provider for antitrust.', 
        impact: { revenue: -10, innovation: 0, risk: 20 }, 
        feedback: 'Long Shot. The contract was clear. You lose the lawsuit and the relationship.' 
      }
    ]
  },
  {
    id: 'mobile-4',
    unit: 'Mobile/IoT',
    title: 'App Fatigue',
    iconType: 'mobile',
    prompt: 'We have launched 5 different apps for our customers (Loyalty, Shop, Support, Community, Credit).',
    options: [
      { 
        id: 'opt1', 
        text: 'Consolidate them into one "Super App".', 
        impact: { revenue: 20, innovation: 15, risk: 5 }, 
        feedback: 'Unified Experience. Downloads increased because users only need one icon. Cross-selling is easier.' 
      },
      { 
        id: 'opt2', 
        text: 'Launch a 6th app for AR try-ons.', 
        impact: { revenue: -5, innovation: 10, risk: 10 }, 
        feedback: 'Bloat. Customers are deleting your apps to save space. Engagement is down.' 
      },
      { 
        id: 'opt3', 
        text: 'Abandon apps and focus on a responsive mobile website.', 
        impact: { revenue: 10, innovation: 5, risk: 0 }, 
        feedback: 'Pragmatic. You lost push notifications, but maintenance costs dropped by 80%.' 
      }
    ]
  }
];

export const TEAM_COLORS = [
  { name: 'Blue Corp', bg: 'bg-blue-600', border: 'border-blue-500', text: 'text-blue-400' },
  { name: 'Red Inc', bg: 'bg-red-600', border: 'border-red-500', text: 'text-red-400' },
  { name: 'Green Ltd', bg: 'bg-green-600', border: 'border-green-500', text: 'text-green-400' },
  { name: 'Purple Co', bg: 'bg-purple-600', border: 'border-purple-500', text: 'text-purple-400' },
];