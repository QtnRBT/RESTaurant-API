# Getting started with RESTaurant API

This page will help you get started with RESTaurant API. I'm sure you'll rock it ! 

With our API, you will be able to create menus for restaurants. We have three categories of things you can create :
1. Items (such as dishes)
2. Categories (which is a group of dishes)
3. Formulas (which are a group of categories with a fixed price)

## Navigation

1. [Installation](#1-installation)
    1. [API installation](#11-api-installation)
    2. [Database installation](#12-database-installation)
2. [Making requests](#2-making-requests)
    1. [POST requests](#21-post-requests)
    2. [GET requests](#22-get-requests)
    3. [DELETE requests](#23-delete-requests)
    4. [PUT requests](#24-put-requests)

## 1. Installation

Before starting any installation, make sure you have [NodeJS](https://nodejs.org/en/) installed on your machine.

### 1.1 API installation

Create a folder wherever you want on your PC and open a terminal.
Then, change directory in your terminal such as below :

```bash
cd WHEREVER/YOU/MADE/A/DIRECTORY
```

Then, we will need to clone this repository to start the API.

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

### 1.2 Database installation

To get started using this API, we will need to install the Database schema that it is using. Fortunately, you're provided the schema in the ```extras/``` folder.

You will need to have some Apache server running with MySQL as well as phpMyAdmin installed. I recommend using [XAMPP](https://www.apachefriends.org/fr/index.html) which is a great tool that will have everything you need included.

Once you have installed XAMPP and that everything is running, you have to open pypMyAdmin. Its URL could vary but it should be [`http://localhost/phpmyadmin/`](http://localhost/phpmyadmin/) by default.

You will be redirected to this page :

![phpMyAdmin homepage](public/phpMyAdminHome.PNG?raw=True)

Now, click the **Import** tab in the top navigation bar. This will redirect you to this page, where you can submit your own **.sql** file :

![phpMyAdmin upload page](public/phpMyAdminUpload.PNG?raw=True)

Now, click **Choose a file** and upload the `extras/restaurant.sql` file. Then, click the **GO** button on the bottom right hand corner of the page.

If everything succeeded, you will land on this page :

![phpMyAdmin upload success](public/phpMyAdminSuccess.PNG?raw=True)

Our database will consist of 4 tables :
1. The **items** table with a name, a price, a description, a category ID and an ID (for the item itself)
2. The **categories** table with an ID, a name and a description (optional)
3. The **formulas** table with an ID, a formula ID, a price and a name (optional)
4. The **category_formulas** table which contains all of the categories' ID of that formula


This is the definition of the **items** table :

| Column name   | Type          | Options       |
| ------------- | ------------- | ------------- |
| id            | INT           | NOT NULL      |
| name          | VARCHAR(45)   | NOT NULL      |
| price         | DECIMAL(5,2)  | NOT NULL      |
| description   | MEDIUMTEXT    | NULL          |
| category_id   | INT           | NOT NULL      |


This is the definition of the **categories** table

| Column name   | Type          | Options       |
| ------------- | ------------- | ------------- |
| id            | INT           | NOT NULL      |
| name          | VARCHAR(45)   | NOT NULL      |
| description   | MEDIUMTEXT    | NULL          |


This is the definition of the **formulas** table

| Column name   | Type          | Options       |
| ------------- | ------------- | ------------- |
| id            | INT           | NOT NULL      |
| formula       | INT           | NOT NULL      |
| price         | DECIMAL(5,2)  | NOT NULL      |
| name          | VARCHAR(45)   | NULL          |


This is the definition of the **category_formulas** table

| Column name   | Type          | Options       |
| ------------- | ------------- | ------------- |
| id            | INT           | NOT NULL      |
| f1            | INT           | NOT NULL      |
| f2            | INT           | NOT NULL      |
| f3            | INT           | NULL          |
| f4            | INT           | NULL          |
| f5            | INT           | NULL          |


Once we have installed everything we need, we can start the API by typing ```nodemon .``` in the terminal.

## 2. Making requests

Now, that everything is properly set up, we can start making requests to our API.
We have three main routes which you can use :
- `/items` To interact with all of the dishes
- `/categories` To interact with the cateogries
- `/formulas` For the formulas 

To make these requests, we will use a tool called [Postman](https://www.postman.com/downloads/) because it allows us to make different types of requests.

We have created a Postman collection for you to use with our API. It's stored under `extras/Postman collection.json`.

Once you start Postman, you will land on this page :

![Postman homepage](public/postmanHome.PNG?raw=True)

When you're ready to get started, click the **Collection** tab and then **Import** to import our collection.

![Postman Upload](public/postmanUpload.PNG?raw=True)

Then, select the `extras/Postman collection.json` file and click **Import**. You should see that a **RESTaurant API** list appeared.



### 2.1 POST requests

Since we currently have nothing stored in our database, we need to start adding some menus.

In the following request's headers, we need to authenticate, otherwise the API won't let us publish anything. To do this, you can use the [Basic access authentication](https://en.wikipedia.org/wiki/Basic_access_authentication) with the `root:admin` credentials.

We will add our first ever category, then we will add another one, then we will add a dish and eventually add a formula.

#### Adding a category

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

Now, in the request's body, we need to include a name and a description, as below :

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

Congratulations, you've created your first category ! We need to create at least one more category before adding a formula, try creating a **Pizzas** category.

#### Adding a dish

Let's add our first dish which will be **Salad**, stored in the **Starters** category. To do this, we need to make a POST request on the `/items` route. You can use the POST requests included in the Postman collection to start.

The request's body :

```json
{
    "name": "Salad",
    "price": 4.99,
    "description": "A good Cesar Salad.",
    "category_id": 4
}
```

The response :
```json
{
    "code": 200,
    "message": "Item Salad sucessfully created."
}
``` 

#### Adding a formula

To create a formula, you need to have at least 2 categories. If you don't use the 5 available slots for categories, you still need to fill in the rest with a **null** value.

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

Now, that we have some data to retrieve from our database, we can start making GET requests. These requests need no particular authentication, so we don't need to add this to our headers. We will need to query the `/items` route in order to get the items.

#### Getting a dish

We have three ways of getting an item. We can either :

- request all the dishes
- request a particular item, from its ID
- request a specific item, by adding search parameters (such as **name**, **price** and **category_id**)

First, let's request all items on the `/items` route. This is the response that we are given :

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

For instance, you can replace **id** with 4 and it will return the same item.

```json
{
    "name": "Salad",
    "price": 4.99,
    "description": "A good Cesar Salad.",
    "category_id": 4,
    "id": 4
}        
```

Then, we can request an item with search parameters. To do this, we need to request the `/items?param=value` route, where **param** is the name of a parameter (such as **name**) and **value** is the value (such as **Salad**). In our case, it will return the same result :

```json
{
    "name": "Salad",
    "price": 4.99,
    "description": "A good Cesar Salad.",
    "category_id": 4,
    "id": 4
}
```

#### Getting a category

To get a category, we cannot use search parameters, so there's only two ways. We can either :

- request all the categories
- request a particular category, from its ID

First, let's request all categories on the `/categories` route. This is the response that we are given :

```json
{
    "categories": [
        {
            "id": 4,
            "name": "Starters",
            "description": "These are the dishes you can start your meal with."
        },
        {
            "id": 5,
            "name": "Pizzas",
            "description": "These are the pizzas our restaurant offers."
        }
    ]
}
```

Then, we can request a specific category from its ID. So we need to query the `categories/id` route, where **id** is a number.

For instance, you can replace **id** with 5 and it will return the following :

```json
{
    "id": 5,
    "name": "Pizzas",
    "description": "These are the pizzas our restaurant offers."
}
```

#### Getting a formula

We have three ways of getting a formula. We can either :

- request all formulas
- request a particular formula, from its ID
- request a specific formula, by adding search parameters (such as **name**, **price** and **category_id**)

First, let's request all formulas on the `/formulas` route. This is the response that we are given :

```json
{
    "formulas": [
        {
            "ID": 1,
            "price": 10.5,
            "name": "Little formula",
            "categories": [
                {
                    "id": 4,
                    "name": "Starters",
                    "description": "These are the dishes you can start your meal with.",
                    "index": 1
                },
                {
                    "id": 5,
                    "name": "Pizzas",
                    "description": "These are the pizzas our restaurant offers.",
                    "index": 2
                }
            ]
        }
    ]
}
```

The same requests as for an item can be done.

### 2.3 DELETE requests

In the following request's headers, we need to authenticate, otherwise the API won't let us delete anything. To do this, you can use the [Basic access authentication](https://en.wikipedia.org/wiki/Basic_access_authentication) with the `root:admin` credentials.

To delete something, simply call the `/something/id` route where **something** is what you want to delete (such as **items**, **categories** or **formulas**) and **id** is the ID of the thing that you want to delete. For instance, if we delete an item, it will return :

```json
{
    "code": 200,
    "message": "Item Salad successfully deleted."
}
```


### 2.4 PUT requests

Put requests are useful if you want to modify the content of something.

In the following request's headers, we need to authenticate, otherwise the API won't let us modify anything. To do this, you can use the [Basic access authentication](https://en.wikipedia.org/wiki/Basic_access_authentication) with the `root:admin` credentials.

To modify something, simply call the `/something/id` route where **something** is what you want to change (such as **items**, **categories** or **formulas**) and **id** is the ID of the thing that you want to delete.

In the request's body, you need to add what you want to change.

For instance, let's change the **Little formula**'s price from **10.5** to **11.5**. This is our request's body :

```json
{
    "price": 11.5
}
```

And this is the response :

```json
{
    "code": 200,
    "message": "Formula successfully updated."
}
``` 

If we get it, we can see that it now returns : 

```json
{
    "ID": 1,
    "price": 11.5,
    "name": "Little formula",
    "categories": [
        {
            "id": 4,
            "name": "Starters ",
            "description": "These are the starters our restaurant offers.",
            "index": 1
        },
        {
            "id": 5,
            "name": "Pizzas",
            "description": "These are the starters our restaurant offers.",
            "index": 2
        }
    ]
}
```