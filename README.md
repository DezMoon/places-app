# Places Explorer: Interactive Map and Data Table Application

[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Mapbox GL JS](https://img.shields.io/badge/Mapbox%20GL%20JS-%233BB2D0.svg?style=for-the-badge&logo=mapbox&logoColor=white)](https://docs.mapbox.com/mapbox-gl-js/api/)
[![Deck.gl](https://img.shields.io/badge/Deck.gl-%234689BD.svg?style=for-the-badge&logo=visgl&logoColor=white)](https://deck.gl/)
[![Material UI](https://img.shields.io/badge/Material%20UI-%230081CB.svg?style=for-the-badge&logo=mui&logoColor=white)](https://mui.com/)

**Places Explorer** is a responsive web application built with React and TypeScript that provides an interactive way to explore a dataset of geographical locations. It features a dynamic map powered by Mapbox and high-performance data visualization using Deck.gl, seamlessly integrated with a sortable, filterable, and customizable data table built with Material UI.

This application is designed to handle large datasets efficiently, offering a smooth and intuitive user experience for exploring and analyzing geographical information.

## ✨ Key Features

* **Dual View:** Simultaneously visualize places on an interactive Mapbox map with Deck.gl for optimized rendering and explore detailed data in a synchronized Material UI table.
* **Efficient Data Handling:** Leverages frontend performance techniques to ensure smooth interaction even with large datasets (approximately 10,000 places).
* **Interactive Map:**
    * Displays all places as markers on a Mapbox map.
    * Highlights selected places on the map.
    * Tooltips display place names on hover.
    * Clicking a map marker selects the corresponding place in the table and vice versa.
    * Map smoothly transitions to a selected location with zoom.
* **Feature-Rich Data Table:**
    * Sort data by clicking on column headers.
    * Filter the table by typing in a search bar, dynamically updating the displayed places.
    * "Reset Filter" button to quickly clear the search.
    * Informative "No Results" message when the filter yields no matches.
    * **Customizable Column Visibility:** Show or hide table columns according to your preferences.
    * **Persistent Column Preferences:** Your preferred column visibility settings are saved and loaded automatically.
* **Responsive Layout:** The application adapts to different screen sizes, providing a consistent experience across devices.
* **TypeScript Powered:** Ensures code maintainability, readability, and helps prevent common JavaScript errors.
* **Material UI Design:** Provides a clean, consistent, and user-friendly interface with well-designed components.

## 🛠️ Technologies Used

* **Core Framework:**
    * [React](https://react.dev/) (Functional Components & Hooks): For building a dynamic and interactive user interface.
    * [TypeScript](https://www.typescriptlang.org/): For enhanced code quality, static typing, and improved developer experience.
* **Mapping & Visualization:**
    * [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/api/): For rendering interactive and customizable maps.
    * [Deck.gl](https://deck.gl/): A powerful WebGL-powered framework for high-performance geospatial data visualization layers (specifically using `ScatterplotLayer`).
    * [react-map-gl](https://visgl.github.io/react-map-gl/): A React wrapper for Mapbox GL JS.
* **UI Components & Styling:**
    * [Material UI](https://mui.com/): A comprehensive library of pre-built, customizable, and accessible React components following Material Design principles.
    * [@mui/icons-material](https://mui.com/material-ui/material-icons/): A collection of ready-to-use icons.
* **Utility & Performance:**
    * [react-tooltip](https://react-tooltip.com/): For creating interactive tooltips on map markers.
    * [react-window](https://react-window.dev/): For efficiently rendering large lists and tables using virtualization techniques.

## 🚀 Getting Started

Follow these steps to get the Places Explorer application running on your local machine:

1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/DezMoon/places-app.git
    cd places-app
    ```

2.  **Install Dependencies:**

    Navigate to the project directory in your terminal and run:

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Obtain and Configure Mapbox Access Token:**

    * If you don't have one, create a free account on [Mapbox](https://www.mapbox.com/).
    * Navigate to your [Mapbox account dashboard](https://account.mapbox.com/) and find your **access token**.
    * In the root of your `places-app` project, create a file named `.env.local`.
    * Add the following line to `.env.local`, replacing `your_mapbox_access_token` with your actual Mapbox access token:

        ```
        REACT_APP_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token
        ```

    * **Note:** This file is typically ignored by Git to prevent accidental exposure of your API key.

4.  **Start the Development Server:**

    Run the following command in your terminal:

    ```bash
    npm start
    # or
    yarn start
    ```

    This will build the application and start a development server. You can then view the application in your web browser at `http://localhost:3000`.

## 🗺️ Data Source

The application utilizes a CSV file (`places.csv`) located in the `public` directory as its primary data source. This file contains information about various places, including:

* `pid`: Place ID (Unique identifier)
* `name`: Name of the place
* `city`: City where the place is located
* `region`: Region or state
* `postal_code`: Postal code
* `tenant_type`: Type of tenant (though currently not explicitly used in all features)
* `longitude`: Geographical longitude
* `latitude`: Geographical latitude

You can replace or modify this `places.csv` file to explore different datasets, ensuring the column names match the expected structure in the code.

## 🤝 Contributing

Contributions to the Places Explorer project are welcome! If you have suggestions for improvements, bug fixes, or new features, please feel free to:

1.  Fork the repository.
2.  Create a new branch for your feature or fix.
3.  Make your changes and commit them.
4.  Push your branch to your forked repository.
5.  Submit a pull request detailing your changes.

## 📄 License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT). Feel free to use, modify, and distribute it as per the terms of the license.

---

Made with ❤️ by me, [DezMoon](https://github.com/DezMoon/) 
