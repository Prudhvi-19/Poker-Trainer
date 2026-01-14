# 🃏 GTO Poker Trainer

A comprehensive, single-page web application for learning and practicing Game Theory Optimal (GTO) poker strategy for 6-max Texas Hold'em cash games. Master preflop ranges, study postflop scenarios, and track your progress—all in your browser with zero backend dependencies.

## ✨ Features

### 📊 Dashboard
- Real-time statistics tracking (daily & overall)
- Accuracy metrics by module and position
- Weakness identification
- Study streak counter
- Quick access to all training modules

### 🎯 Preflop Trainer
- **RFI (Raise First In)**: Practice opening ranges for all positions
- **3-Bet Trainer**: Learn optimal 3-betting strategy
- **4-Bet Trainer**: Master 4-bet vs 3-bet decisions (4-bet, call, or fold)
- **Cold Call Trainer**: Practice calling facing raises in multiway scenarios
- **Squeeze Trainer**: Learn squeeze play (raise vs call + caller scenarios)
- **BB Defense**: Master big blind defense vs all positions
- Real-time feedback with explanations
- Session statistics and accuracy tracking
- Auto-save progress to localStorage
- Full keyboard shortcut support (R/C/F/Space)

### 🎲 Postflop Trainer
- **C-Bet Trainer**: Learn when to continuation bet (bet vs check decisions)
- **Facing C-Bet Trainer**: Master c-bet defense (fold vs call vs raise)
- **Turn Play Trainer**: Practice turn decisions (barrel vs give up)
- **River Play Trainer**: Learn river value betting and bluff decisions
- **Board Texture Quiz**: Train board texture recognition (dry/wet/static/dynamic)
- Position-aware GTO frequencies (IP vs OOP)
- Dynamic board generation with all streets (flop, turn, river)
- Board texture classification algorithm
- Real-time feedback with board texture analysis
- Session statistics and accuracy tracking
- Full keyboard shortcut support

### 🎨 Hand Range Visualizer
- Interactive 13×13 hand grid
- Click to select/deselect hands
- GTO range presets (RFI, 3-bet, BB defense for all positions)
- Range statistics (combos, percentage)
- Save custom ranges
- Compare ranges side-by-side

### 📈 Charts Reference
- Complete GTO charts for 6-max cash games
- RFI ranges: UTG (~15%), HJ (~18%), CO (~28%), BTN (~48%), SB (~45%)
- 3-Bet ranges vs each position
- BB Defense ranges (vs UTG to vs SB)
- Print-friendly formatting
- Visual grids + text lists

### 📚 Scenarios Library
- 20+ curated poker situations with detailed analysis
- Categories: Preflop Essentials, C-Betting, Turn/River, BB Defense, 3-Bet Pots, Multiway, Tricky Spots
- Each scenario includes:
  - Setup and decision point
  - Correct play with explanation
  - Common mistakes
  - Key concepts demonstrated
- Filter by category and difficulty
- Mark scenarios as studied
- Progress tracking

### 🧠 Concepts & Theory
- Complete poker theory curriculum
- **Fundamentals**: Position, pot odds, equity, EV, ranges
- **Preflop Theory**: RFI strategy, 3-betting, blind defense
- **Postflop Theory**: C-betting, board texture, bet sizing
- **Advanced Concepts**: GTO vs exploitative, balance, blockers
- Expandable sections for easy navigation
- Track which concepts you've studied

### 📜 Session History
- Detailed history of all practice sessions
- Performance metrics: accuracy, hands played, avg response time
- Session breakdowns showing each hand
- Export data as JSON
- Overall performance dashboard

### ⚙️ Settings
- **Display**: 4-color/2-color deck, font size, sound effects
- **Training**: Session length, hints, difficulty
- **Data Management**: Export/import data, reset progress

## 🎮 How to Use

### Getting Started

1. **Clone or Download** this repository
2. **Open `index.html`** in a modern web browser
3. **Start Practicing!** No build process or server required

### Recommended Study Path

1. **Learn the Theory**: Start with Concepts & Theory to understand the fundamentals
2. **Review Charts**: Study the GTO ranges in Charts Reference
3. **Practice Preflop**: Use the Preflop Trainer (start with RFI, then 3-bet, then BB defense)
4. **Study Scenarios**: Work through the Scenarios Library for real-world situations
5. **Use the Visualizer**: Build and compare ranges to deepen understanding
6. **Track Progress**: Monitor your improvement in Session History

### Keyboard Shortcuts

- `R` = Raise
- `C` = Call
- `F` = Fold
- `Space` = Next hand
- `1-6` = Bet sizing options (when applicable)

## 🏗️ Project Structure

```
Poker-Trainer/
├── index.html                 # Main HTML file
├── css/
│   ├── variables.css          # Design tokens and theme
│   ├── base.css               # Reset and base styles
│   ├── layout.css             # App layout and grid
│   ├── components.css         # Reusable UI components
│   ├── modules.css            # Module-specific styles
│   └── responsive.css         # Mobile/tablet responsive design
├── js/
│   ├── app.js                 # Main application entry point
│   ├── router.js              # Client-side routing
│   ├── utils/
│   │   ├── constants.js       # App-wide constants
│   │   ├── storage.js         # localStorage wrapper
│   │   ├── helpers.js         # Utility functions
│   │   └── stats.js           # Statistics calculations
│   ├── data/
│   │   ├── ranges.js          # GTO range data
│   │   ├── scenarios.js       # Practice scenarios
│   │   └── concepts.js        # Theory content
│   ├── components/
│   │   ├── Card.js            # Playing card rendering
│   │   ├── HandGrid.js        # 13×13 range selector
│   │   ├── Navigation.js      # Sidebar navigation
│   │   └── Modal.js           # Modal dialogs
│   └── modules/
│       ├── dashboard.js       # Dashboard module
│       ├── preflopTrainer.js  # Preflop training
│       ├── postflopTrainer.js # Postflop training (c-bet, turn, river)
│       ├── rangeVisualizer.js # Range visualizer
│       ├── charts.js          # Charts reference
│       ├── scenarios.js       # Scenarios library
│       ├── concepts.js        # Concepts & theory
│       ├── sessionHistory.js  # Session tracking
│       └── settings.js        # App settings
└── README.md
```

## 🎯 GTO Ranges Included

All ranges are based on modern GTO solver outputs for 6-max cash games:

### RFI (Raise First In)
- **UTG**: ~15% (premiums, strong broadways, suited connectors)
- **HJ**: ~18% (adds more suited aces, small pairs)
- **CO**: ~28% (significantly wider, more suited hands)
- **BTN**: ~48% (very wide, nearly half of all hands)
- **SB**: ~45% (wide vs BB only)

### 3-Bet Ranges
- **vs UTG**: ~5% (tight, mostly value)
- **vs HJ**: ~6% (slightly wider, add bluffs)
- **vs CO**: ~8% (more suited connectors)
- **vs BTN**: ~11% (wide defense vs BTN steal)
- **vs SB**: ~14% (widest, BB defense)

### BB Defense Ranges
- **vs UTG**: ~15% (tight, only strong hands)
- **vs HJ**: ~20%
- **vs CO**: ~27%
- **vs BTN**: ~40% (defend wide vs button)
- **vs SB**: ~55% (widest defense, getting great odds)

## 🛠️ Technical Details

### Technologies Used
- **Pure HTML/CSS/JavaScript** (ES6 modules)
- No frameworks or build tools required
- localStorage for data persistence
- Fully responsive design
- Works offline after first load

### Browser Compatibility
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Responsive design

### Performance
- Lightweight (~200KB total)
- Instant page loads
- No external dependencies
- All data stored locally

## 🎨 Design Philosophy

- **Dark Theme**: Easy on the eyes for long study sessions
- **4-Color Deck Option**: Improve readability and reduce mistakes
- **Mobile-First**: Works great on all devices
- **Keyboard Navigation**: Efficient practice with hotkeys
- **Print-Friendly**: Charts can be printed for reference

## 📊 Data Storage

All data is stored in your browser's localStorage:
- Practice sessions (last 100 sessions)
- Progress metrics
- Custom ranges
- User settings
- Study streak

**Export Your Data**: Use Settings → Export Data to backup your progress

## 🚀 Future Enhancements

- [ ] Advanced multi-street scenarios (flop → turn → river practice)
- [ ] Hand replayer for analyzing played hands
- [ ] Equity calculator with range vs range
- [ ] GTO bot to play against
- [ ] Achievement system and badges
- [ ] Study plan generator based on weaknesses
- [ ] Spaced repetition system for weak areas
- [ ] Range vs range equity visualization
- [ ] Custom scenario builder
- [ ] Multi-language support

## 🤝 Contributing

This is an open-source project. Contributions are welcome!

**Areas for contribution:**
- Additional scenarios and situations
- More detailed theory content
- Bug fixes and optimizations
- UI/UX improvements
- Advanced multi-street scenario trainer
- Equity calculator implementation
- Range vs range analysis tools

## 📝 License

This project is provided as-is for educational purposes. Poker ranges are based on publicly available GTO solutions.

## 🙏 Acknowledgments

- GTO ranges derived from modern solver outputs (PioSOLVER, GTO+)
- Poker theory from established strategy resources
- Built for the poker community to improve their game

## 📧 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing scenarios and concepts for answers
- Review the Charts Reference for strategy questions

---

**Remember**: GTO is a baseline. Use it as your default strategy and adjust based on opponents' tendencies for maximum profit!

*Made with ♠️ by poker enthusiasts, for poker enthusiasts.*
