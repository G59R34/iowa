# 🚗 Altima Sim - Drive Like a Maniac

A chaotic driving game where you control a Nissan Altima and drive as aggressively as possible through AI traffic. The goal is to rack up the highest aggression score by cutting off cars, near misses, and general road chaos!

## 🌽 Game Features

### **Core Gameplay**
- **Drive a Nissan Altima** with realistic damage (missing bumper, dents, scratches)
- **AI Traffic** - 10-15 cars driving around that you can cut off
- **Aggression Scoring** - Points for aggressive driving behavior
- **Google Maps Integration** - Real street maps as your driving environment
- **Particle Effects** - Visual feedback for collisions and near misses
- **Sound Effects** - Horn, crash, and engine sounds

### **Scoring System**
- **Cut Off Cars**: +10 Aggression Points
- **Near Misses**: +15 Aggression Points  
- **Horn Blast**: +5 Aggression Points
- **High Speed**: +1 Aggression Point (above 80 mph)
- **Boost Mode**: +5 Aggression Points
- **Chaos Mode**: Activated at 500+ aggression points

### **Visual Effects**
- **Speed Lines** - Appear when driving fast
- **Particle Explosions** - When cutting off cars or near misses
- **Chaos Mode** - Screen effects at high aggression
- **Aggressive Driving Shake** - Car shakes when driving fast
- **AI Car Reactions** - Cars turn red and shake when cut off

## 🎮 Controls

- **W / ↑** - Accelerate
- **S / ↓** - Brake
- **A / ←** - Turn Left
- **D / →** - Turn Right
- **Space** - Horn
- **Shift** - Boost (increases speed and aggression)
- **R** - Reset Position

## 🚀 Setup Instructions

### **1. Google Maps API Key**
You'll need a Google Maps API key for the map to work:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Maps JavaScript API
4. Create credentials (API Key)
5. Replace `YOUR_GOOGLE_MAPS_API_KEY` in `altima-sim.html`

### **2. Run the Game**
1. Open `altima-sim.html` in your browser
2. Click "START DRIVING" to begin
3. Drive aggressively and try to get the highest score!

### **3. Alternative Setup (No API Key)**
If you don't want to set up Google Maps, you can modify the game to work without it:

```javascript
// In altima-sim.js, comment out the initMap() call in startGame()
// this.initMap(); // Comment this line
```

## 🏆 Scoring Strategy

### **High Score Tips**
1. **Use Boost** - Hold Shift while driving for extra speed and points
2. **Cut Off Cars** - Get close to AI cars to cut them off (+10 points)
3. **Near Misses** - Get close but don't crash (+15 points)
4. **Horn Constantly** - Spam the horn for extra points
5. **High Speed** - Stay above 80 mph for continuous points
6. **Chaos Mode** - Reach 500+ points for visual effects

### **Avoiding Game Over**
- Don't crash into other cars (game over)
- Use R to reset position if you get stuck
- Keep moving to avoid being hit

## 🎨 Customization

### **Modifying Car Appearance**
Edit the CSS in `altima-sim.css`:
```css
.car-front, .car-middle, .car-back {
    /* Change car colors */
    background: linear-gradient(45deg, #your-color, #your-color);
}
```

### **Adding New Effects**
Add new particle effects in the `createParticles()` method:
```javascript
createParticles(x, y, '#your-color');
```

### **Modifying AI Behavior**
Edit the `updateAITraffic()` method to change how AI cars move.

## 🔧 Technical Details

### **Game Engine**
- **60 FPS Game Loop** - Smooth gameplay
- **Collision Detection** - Distance-based collision system
- **Particle System** - Dynamic particle creation and cleanup
- **Sound Management** - Audio feedback for actions
- **State Management** - Menu, playing, and game over states

### **Performance Optimizations**
- **Efficient Rendering** - Only update visible elements
- **Memory Management** - Automatic cleanup of particles and effects
- **Responsive Design** - Works on desktop and mobile

## 🐛 Troubleshooting

### **Map Not Loading**
- Check your Google Maps API key
- Ensure the API is enabled in Google Cloud Console
- Check browser console for errors

### **Game Not Starting**
- Make sure all files are in the same directory
- Check browser console for JavaScript errors
- Try refreshing the page

### **Performance Issues**
- Close other browser tabs
- Reduce browser zoom level
- Check if hardware acceleration is enabled

## 🎯 Future Enhancements

### **Planned Features**
- **Multiple Maps** - Different cities to drive in
- **Car Upgrades** - Improve your Altima's performance
- **Power-ups** - Temporary boosts and abilities
- **Multiplayer** - Race against other players
- **Leaderboards** - Compare scores with others
- **Achievements** - Unlockable goals and rewards

### **Possible Modifications**
- **Different Cars** - Choose from various vehicles
- **Weather Effects** - Rain, snow, fog
- **Time of Day** - Day/night driving
- **Traffic Laws** - Police chases and tickets
- **Custom Maps** - Create your own driving areas

## 🌽 Anti-Iowa Cult Integration

This game fits perfectly with the Anti-Iowa Cult theme:
- **Chaotic driving** represents the cult's disregard for conventional rules
- **Aggressive behavior** mirrors the cult's rebellious nature
- **Missing bumper and damage** symbolizes the cult's "rough around the edges" aesthetic
- **Google Maps integration** allows you to drive anywhere except Iowa (because Iowa doesn't exist!)

---

🚗 **Start your engine and drive like a maniac!** 🚗

Remember: In the Anti-Iowa Cult, we don't follow traffic laws - we make our own rules! 🌽 