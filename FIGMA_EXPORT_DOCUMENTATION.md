# CLIP Platform - Modern Gaming UI Kit
## Figma Export Documentation

### 🎨 Design System Overview

This document outlines the modern streaming/gaming design system inspired by Kick.com, Clipstake, and Pump.fun for export to Figma.

---

## 🎯 Color Palette

### Primary Colors
- **Gaming Purple**: `#8B5FFF` (hsl(255, 65%, 67%))
- **Neon Green**: `#00FF88` (hsl(158, 100%, 50%))
- **Hot Pink**: `#FF1B8D` (hsl(329, 100%, 56%))

### Background System
- **Background**: `#0A0B0F` (hsl(218, 23%, 6%))
- **Card Background**: `#0F1015` (hsl(218, 23%, 8%))
- **Glass Background**: `rgba(15, 16, 21, 0.8)` with backdrop blur
- **Foreground**: `#F8FAFC` (hsl(220, 20%, 97%))

### Utility Colors
- **Muted**: `#1A1C23` (hsl(218, 23%, 12%))
- **Border**: `#252731` (hsl(218, 23%, 18%))
- **Input**: `#13141A` (hsl(218, 23%, 10%))

---

## 📝 Typography System

### Fonts
- **Primary**: Inter (300, 400, 500, 600, 700, 800, 900)
- **Display/Gaming**: Clash Display (400, 500, 600, 700, 800, 900)

### Hierarchy
- **H1**: Clash Display, 700 weight, -0.02em letter spacing
- **H2**: Clash Display, 600 weight, -0.01em letter spacing
- **Body**: Inter, 400-500 weight
- **UI Text**: Inter, 500-600 weight

---

## 🎮 Component Library

### Buttons

#### Primary Button
- **Background**: Gaming Purple gradient
- **Border**: 1px solid rgba(139, 95, 255, 0.2)
- **Height**: 48px (lg), 40px (default), 36px (sm)
- **Padding**: 24px horizontal (lg), 16px (default)
- **Border Radius**: 12px
- **Font**: Inter Semibold
- **Hover**: Scale 1.05, glow effect
- **Transition**: 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)

#### Secondary Button
- **Background**: Neon Green gradient
- **Text Color**: Dark background (#0A0B0F)
- **Same dimensions as Primary**

#### Accent Button
- **Background**: Hot Pink gradient
- **Text Color**: Light foreground
- **Same dimensions as Primary**

#### Ghost Button
- **Background**: Transparent with backdrop blur
- **Border**: None
- **Hover**: Subtle muted background

#### Outline Button
- **Background**: Transparent
- **Border**: 2px solid Gaming Purple
- **Hover**: Subtle purple background with glow

### Cards

#### Gaming Card
- **Background**: Glass effect - rgba(15, 16, 21, 0.8)
- **Backdrop Filter**: blur(20px)
- **Border**: 1px solid rgba(248, 250, 252, 0.1)
- **Border Radius**: 20px
- **Shadow**: Multiple layers with glow effects
- **Top Border**: Gradient line (Purple → Green → Pink)
- **Hover**: Transform translateY(-8px) scale(1.02)
- **Transition**: 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)

#### Glass Variants
- **Primary Glass**: Purple tint with blur
- **Secondary Glass**: Green tint with blur
- **Accent Glass**: Pink tint with blur

### Inputs

#### Modern Input
- **Height**: 48px
- **Background**: Glass effect with backdrop blur
- **Border**: 1px solid input color
- **Border Radius**: 12px
- **Padding**: 16px horizontal
- **Focus**: Purple border with glow effect
- **Placeholder**: Muted foreground color

### Navigation

#### Sidebar
- **Width**: 256px (expanded), 64px (collapsed)
- **Background**: Darkest background with glass effect
- **Items**: Rounded rectangles with hover glow
- **Active State**: Purple background with border accent
- **Icons**: 20px size
- **Typography**: Inter Medium

---

## ✨ Effects & Animations

### Glow Effects
- **Primary Glow**: `0 0 40px rgba(139, 95, 255, 0.4)`
- **Secondary Glow**: `0 0 40px rgba(0, 255, 136, 0.4)`
- **Accent Glow**: `0 0 40px rgba(255, 27, 141, 0.4)`

### Hover Animations
- **Lift Effect**: translateY(-6px) scale(1.02)
- **Button Hover**: scale(1.05)
- **Micro Interactions**: scale(0.98) on press

### Transitions
- **Standard**: 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)
- **Fast**: 0.2s ease-out
- **Slow**: 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)

---

## 📐 Spacing System

### Base Scale
- **XS**: 4px
- **SM**: 8px
- **MD**: 16px
- **LG**: 24px
- **XL**: 32px
- **2XL**: 48px
- **3XL**: 64px

### Border Radius Scale
- **Default**: 16px
- **Large**: 24px
- **XL**: 32px
- **Card**: 20px

---

## 🔧 UI Kit Components

### Badges
- **Height**: 28px
- **Padding**: 12px horizontal
- **Border Radius**: Full (14px)
- **Font**: Inter Semibold, 12px
- **Variants**: Primary, Secondary, Accent, Glass

### Toggles
- **Width**: 44px
- **Height**: 24px
- **Thumb Size**: 20px
- **Background**: Input color (off), Primary color (on)
- **Animation**: 0.2s ease transform

### Progress Bars
- **Height**: 8px
- **Background**: Muted color
- **Fill**: Gradient matching variant
- **Border Radius**: Full
- **Animation**: 0.5s ease-out width change

### Status Indicators
- **Size**: 8px circle
- **Online**: Pulsing green
- **Offline**: Static muted
- **Away**: Yellow
- **Busy**: Red with glow

---

## 📱 Responsive Breakpoints

- **Mobile**: 0-768px
- **Tablet**: 768px-1024px
- **Desktop**: 1024px+
- **Large Desktop**: 1400px+

---

## 🎯 Implementation Notes

### Glassmorphism
All glass effects use:
- Background: `rgba(15, 16, 21, 0.8)`
- Backdrop filter: `blur(12-20px)`
- Border: `1px solid rgba(248, 250, 252, 0.1)`

### Dark Theme Optimization
- High contrast ratios (7:1 minimum)
- Subtle gradients for depth
- Multiple shadow layers for elevation
- Neon accents for gaming feel

### Accessibility
- Focus states with 2px outline
- Keyboard navigation support
- Screen reader compatible
- High contrast mode friendly

---

## 🎨 Figma Setup Instructions

1. **Create Color Styles**
   - Import all color variables
   - Set up semantic naming (primary, secondary, etc.)

2. **Typography Styles**
   - Import Inter and Clash Display fonts
   - Create text styles for all hierarchy levels

3. **Component Variants**
   - Create master components for buttons, cards, inputs
   - Set up interactive states (default, hover, pressed, disabled)

4. **Effect Styles**
   - Create glow effects as drop shadows
   - Set up glass blur effects
   - Define transition specifications

5. **Auto Layout**
   - Configure responsive behavior
   - Set up spacing tokens
   - Define grid systems

This design system creates a cohesive, modern gaming interface that maintains functionality while providing a premium streaming platform aesthetic.