<div align="center">
  <h1>🌟 Muse</h1>
  <p><strong>Premium Artificial Jewelry Store</strong></p>
</div>

---

**Muse** is a modern, high-end e-commerce platform dedicated to premium artificial jewelry. Built with the latest web technologies, Muse offers a seamless shopping experience for customers and a powerful management interface for administrators.

## ✨ Features

### For Shoppers
- **Elegant User Interface**: A beautifully designed frontend tailored for luxury aesthetics.
- **Dynamic Homepage**: Featuring New Arrivals, Best Sellers, Curated Collections, and 'Shop the Look' segments.
- **Responsive Design**: Flawless experience across desktop, tablet, and mobile devices.
- **Instagram Gallery & Testimonials**: Social proof to build trust and showcase real-world looks.
- **Fast & Fluid Interactions**: Smooth animations and micro-interactions for a premium feel.

### For Administrators
- **Admin Dashboard**: Dedicated, secure portal to manage the storefront.
- **Product Management**: Easy-to-use interface to add, edit, or remove jewelry items, manage pricing and categories.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) & [Base UI](https://base-ui.com/)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js installed (v20+ recommended) and a [Supabase](https://supabase.com/) project set up.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/23f3003672/Muse.git
   cd Muse
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up Environment Variables:**
   Copy the example environment file and fill in your Supabase credentials:
   ```bash
   cp .env.example .env.local
   ```
   *Note: Ensure you add your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from your Supabase dashboard.*

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

- `/src/app` - Next.js App Router pages (including public storefront and `/admin` panel)
- `/src/components` - Reusable UI components organized by feature (home, layout, etc.)
- `/src/lib` - Utility functions, data fetching, and Supabase client setup
- `/src/store` - Zustand state management stores
- `/public` - Static assets and fonts

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/23f3003672/Muse/issues).

---
*Crafted with ❤️ for jewelry enthusiasts.*
