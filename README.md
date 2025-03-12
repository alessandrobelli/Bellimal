# Bellimal Ghost Theme

## Introduction
Welcome to Bellimal, a minimalist Ghost theme designed for a sleek and professional online presence. Whether you are a blogger, software engineer, or a game developer, Bellimal offers a clean and modern layout with subtle animations and customizations to enhance your content.

## Features
- **Minimalist Design**: Clean, modern layout with subtle animations.
- **Custom Colors**: Anthracite and Orange Valencia for a cohesive aesthetic.
- **Responsive Layout**: Fully responsive, ensuring your site looks great on all devices.
- **Custom Components**: Includes tailored components like the "You Might Like" section and more.
- **SEO Optimized**: Built with best SEO practices in mind to help your site rank better.

## Installation
1. **Download** the theme from the [GitHub repository](#).
2. **Upload** the theme via the Ghost Admin interface.
3. **Activate** the theme from the settings.

## Customization
To customize the theme:
1. **Edit CSS**: Modify `assets/css/input.css` for custom styles.
2. **Tailwind Config**: Adjust `tailwind.config.js` for color and font changes.
3. **Build css**: Run `npm run build:css` to compile the CSS.
4. **Templates**: Customize template files in the theme directory for layout changes.

### Dark Mode
The theme includes dark mode support:
- Toggle between light and dark mode using the icon in the navigation sidebar
- User preference is stored in localStorage
- If no preference is set, the theme will follow the system preference

**Important**: After making changes to the CSS or Tailwind configuration, you must recompile the CSS for changes to take effect:
```bash
npm run build:css
# or
npx tailwindcss -i ./assets/css/input.css -o ./assets/css/main.css
```

## Tailwind CSS
Bellimal uses Tailwind CSS for styling. The Tailwind configuration is found in `tailwind.config.js`, where you can extend the theme's colors, fonts, and more.

## Misc

### Ghost General Information
[Ghost](https://ghost.org/) uses a simple templating language called [Handlebars](http://handlebarsjs.com/) for its themes.

I developed this theme using this tutorial: https://dev.to/mattlehrer/how-to-setup-tailwindcss-with-a-custom-ghost-theme-5hmk

### Contributing
Please see [CONTRIBUTING](CONTRIBUTING.md) for details.

### Security
If you discover any security related issues, please email alessandrobelli90@gmail.com instead of using the issue tracker.

### Credits
- [Alessandro Belli](https://github.com/AlessandroBelli)
- [All Contributors](../../contributors)

### License
The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
