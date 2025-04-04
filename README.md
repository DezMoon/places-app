# React Map and Data Table Application

This project is a React application built using TypeScript, Mapbox, Deck.gl, and Material UI. It visualizes a dataset of approximately 10,000 places on a map and displays the same data in a sortable and filterable table.

## Technologies Used

* **React (Functional Components):** For building the user interface.
* **TypeScript:** For static typing and improved code maintainability.
* **Mapbox:** For rendering geospatial data on a map.
* **Deck.gl:** For high-performance map layer rendering.
* **Material UI:** For consistent and responsive UI components and layout.

## Features

* **Map and Table View:** Displays all places on a Mapbox map using Deck.gl and in a Material UI table.
* **Filtering and Sorting:** Enables users to filter and sort data by all columns in the table.
* **Frontend Performance:** Optimized for smooth handling of large datasets, ensuring responsive interactions.
* **Data Source:** Uses a provided dataset containing fields like `pid`, `name`, `city`, `region`, `postal_code`, `tenant_type`, `longitude`, and `latitude`.

## Getting Started

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/DezMoon/places-app.git
    cd places-app
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Add Mapbox Access Token:**
    * Create a Mapbox account and obtain an access token.
    * Create a `.env.local` file in the root of your project.
    * Add your Mapbox access token to the `.env.local` file:
        ```
        REACT_APP_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token
        ```

4.  **Run the application:**

    ```bash
    npm start
    # or
    yarn start
    ```

    The application will be available at `http://localhost:3000`.
