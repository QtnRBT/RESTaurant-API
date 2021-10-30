# Getting started with RESTaurant API

This page will help you get started with RESTaurant API. I'm sure you'll rock it ! 

With our API, you will be able to create menus for restaurants. We have three categories of things you can create :
1. Items (such as dishes)
2. Categories (which is a group of dishes)
3. Formulas (which are a group of categories with a fixed price)

## Navigation

1. [Installation](#1-installation)
2. [Making requests](#2-making-requests)

## 1. Installation

Before starting any installation, make sure you have [NodeJS](https://nodejs.org/en/) installed on your machine.

### API Installation

Create a folder wherever you want on your PC and open a terminal.
Then change directory in your terminal such as below :

```bash
cd WHEREVER/YOU/MADE/A/DIRECTORY
```

Then we will need to clone this repository to start the API.

```bash
git clone git@github.com:EpitechDigitalPromo2026/D-API-100-D-API-100_Bordeaux_quentin-robert.git
```

Then, it will download all the code in the folder `D-API-100-D-API-100_Bordeaux_quentin-robert`.

Before starting the api, we need to make sure we have all the required modules downloaded, as they are not included in the repository.

To do this, you first need to head into the main folder which is `/D-API-100-D-API-100_Bordeaux_quentin-robert`.

```bash
cd D-API-100-D-API-100_Bordeaux_quentin-robert
```

We will use NPM to install all of the modules.

```bash
npm install
```

### Database installation

To get started using this API, we will need to install the Database schema that it is using. Fortunately, you're provided the schema in the ```extras/``` folder.

You will need to have some Apache server running with MySQL as well as phpMyAdmin installed. I recommend using [XAMPP](https://www.apachefriends.org/fr/index.html) which is a great tool that will have everything you need included.

Once you have installed XAMPP and that everything is running, you have to open pypMyAdmin. Its URL could vary but it should be [`http://localhost/phpmyadmin/`](http://localhost/phpmyadmin/) by default.

You will be redirected to this page :

![phpMyAdmin homepage](images/phpMyAdminHome.PNG?raw=True)

Now, click the **Import** tab in the top navigation bar. This will redirect you to this page, where you can submit your own **.sql** file :

![phpMyAdmin upload page](images/phpMyAdminUpload.PNG?raw=True)

Now click **Choose a file** and upload the `extras/restaurant.sql` file. Then click the **GO** button on the bottom right hand corner of the page.

If everything succeeded, you will land on this page :

![phpMyAdmin upload success](images/phpMyAdminSuccess.PNG?raw=True)

Our database will have 4 tables :
1. The **items** table with a name, a price, a description, a category ID and an ID (for the item itself)
2. The **categories** table with an ID, a name and a description (optional)
3. The **formulas** table with an ID, a formula ID, a price and a name (optional)
4. The **category_formulas** table which contains all of the categories' ID of that formula



Once we have installed everything we need, we can start the API by typing ```nodemon .``` in the terminal.

## 2. Making requests

Now that everything is properly set up, we can start making requests to our API.
We have three main routes which you can use :
- `/items` To interact with all of the dishes
- `/categories` To interact with the cateogries
- `/formulas` For the formulas 

To make these requests, we will use a tool called [Postman](https://www.postman.com/downloads/) because it allows us to make different types of requests.

We have created a Postman collection for you to use with our API. It's stored under `extras/Postman collection.json`.

Once you start Postman, you will land on this page :

![Postman homepage](images/postmanHome.PNG?raw=True)

When you're ready to get started, click the **Collection** tab and then **Import** to import our collection.

![Postman Upload](images/postmanUpload.PNG?raw=True)

Then select the `extras/Postman collection.json` file and click **Import**. You should see that a **RESTaurant API** list appeared.



### 2.1 POST requests

Since we currently have nothing stored in our database, we need to start adding some menus.

We will add our first ever category, then we will add another one, then we will add a dish and finally add a formula.

#### Adding a category

In the following request's headers, we need to authenticate, otherwise the API won't let us publish anything. To do this, you can use the [Basic access authentication](https://en.wikipedia.org/wiki/Basic_access_authentication) with the `root:admin` credentials.

Let's add our first category which will be **Starters**. To do this, we need to make a POST request on the `/categories` route. You can use the POST requests included in the Postman collection to start.

If we don't authenticate, the API will return this error :

```json
{
    "code": 401,
    "message": "You're not allowed to do that. Please add an Authorization field to your headers."
}
```

And if we put in wrong credentials:

```json
{
    "code": 401,
    "message": "Wrong admin credentials."
}
```

Now, in the request's body, we need to include a name and a description, as done below :

```json
{
    "name": "Starters",
    "description": "These are the dishes you can start your meal with."
}
``` 

Which will result in this response :

```json
{
    "code": 200,
    "message": "Category Starters successfully created."
}
```

Congratulations, you created your first category ! We need to create at least one more category before adding a formula, try creating a **Pizzas** category.

#### Adding a dish

Let's add our first dish which will be **Salad**, classified in the **Starters** category. To do this, we need to make a POST request on the `/items` route. You can use the POST requests included in the Postman collection to start.

The request's body :

```json
{
    "name": "Salad",
    "price": 4.99,
    "description": "A good Cesar Salad.",
    "category_id": 4
}
```

The resonse :
```json
{
    "code": 200,
    "message": "Item Salad sucessfully created."
}
``` 

#### Adding a formula

To create a formula, you need to have at least 2 categories. If you don't use the 5 available slots for categories, you still need to fill in the rest with **null**.

Let's add our first formula which will be **Little formula**, including **Starters** and **Pizzas** categories. To do this, we need to make a POST request on the `/items` route. You can use the POST requests included in the Postman collection to start.

The request's body : 

```json
{
    "name": "Little formula",
    "price": 10.50,
    "category_one": 4,
    "category_two": 5,
    "category_three": null,
    "category_four": null,
    "category_five": null
}
```

The response :

```json
{
    "code": 200,
    "message": "Formula successfully created."
}
```

### 2.2 GET requests

Now that we have some data to retrieve from our database, we can start making GET requests. These requests need no particular authentication, so we don't need to add this to our headers. We will need to query the `/items` route in order to get the items.

#### Getting a dish

We have three ways to get an item. We can either :

- request all the dishes
- request a particular item, from its ID
- request a specific item, by adding search parameters (such as **name**, **price** and **category_id**)

First, let's request all of the items. This is the response that we are given :

```json
{
    "items": [
        {
            "name": "Salad",
            "price": 4.99,
            "description": "A good Cesar Salad.",
            "category_id": 4,
            "id": 4
        }
    ]
}
```

Then, we can request a specific item from its ID. So we need to query the `items/id` route, where **id** is a number.

For instance, let's try 
