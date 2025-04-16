import { GraphQLClient, gql } from "graphql-request";

const MASTER_URL=process.env.NEXT_PUBLIC_BACKEND_API_URL;

const AUTH_TOKEN = process.env.NEXT_PUBLIC_HYGRAPH_AUTH_TOKEN;

const client = new GraphQLClient(MASTER_URL,{
  headers:{
    Authorization: `Bearer ${AUTH_TOKEN}`,
  },
});


/**
* Used to Make Get Category API request
 * @returns
 * 
  */


const GetCategory=async()=>{

const query=gql`
    query Categories {
  categories{
    id
    slug
    name
    icon{
      url
    }
  }
}
`;
try {
  const result = await client.request(query)
  return result; // Return the response
} catch (error) {
  console.error("Error fetching categories:", error); // Log errors for debugging
  return { categories: [] };
}
};

const GetRestaurant = async()=>{
  const query=gql`
  query GetRestaurant {
    restaurants(where: {slug: "royalspoon-foods-and-events"}){
    aboutUs
    address
    banner{
      url
    }
    categories{
      name
    }
      id
      name
      restroType
      slug
      workingHours
      review{
        star
      }
    }
  }
  `;
  try {
    const result = await client.request(query);
    return result;
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    return {restaurants: null};
  }
}

const GetBusinessDetail=async(businessSlug)=>{
  const query= gql `
  query RestaurantDetail{
  restaurants(where:{slug:"`+businessSlug+`"}){
    aboutUs
    address
    banner{
      url
    }
    categories{
      id
      name
      slug
    }
    id
    name
    restroType
    slug
    workingHours
    menu{
        id
        category{
          id 
          name
        }
        menuItem(first: 100){
            id
            name
            description
            price
            productImage{
              url
            }
          }
        }
      review {
        star
      }
    }
  }
  `;
  
  try {
    const result = await client.request(query);
    return result;
  } catch (error) {
    console.error("Error fetching business:", error);
    return [];
  }
}

  const AddToCart = async (data)=>{
    const query = gql`
    mutation AddToCart {
      createUserCart(
        data: {
          email: "`+data?.email+`", 
          price:`+data.price+`, productDescription: "`+data.description+`", 
          productImage: "`+data.productImage+ `", 
          productName: "`+data.productName+`",
          restaurant: {connect: {slug:"`+data.restaurantSlug+`"}}
        }
      ) {
        id
      }
      publishManyUserCartsConnection(to: PUBLISHED) {
        edges{
          node{
            id
          }
        }
      }
    }`;

    try {
      const result = await client.request(query);
      return result;
    } catch (error) {
      console.error("Error adding to cart:", error);
      return null;
    }
  }

  const GetUserCart = async (userEmail)=>{
    const query = gql`
    query GetUserCart {
      userCarts(where: {email: "`+userEmail+`"}) {
        id
        price
        productDescription
        productImage
        productName
        restaurant {
          name
          banner {
            url
          }
          slug
        }
      }
    }`
    try {
      const result = await client.request(query);
      return result;
    } catch (error) {
      console.error("Error fetching business:", error);
      return [];
    }
  }

  
  const DisconnectRestroFromCartItem = async (id)=>{
    const query = gql`
    mutation DisconnectRestaurantFromCartItem {
      updateUserCart(data: {restaurant: {disconnect: true}}, where: {id: "`+id+`"}) {
        id
      }
      publishManyUserCartsConnection(to: PUBLISHED) {
        edges{
          node{
            id
          }
        }
      }
    }`
    try {
      const result = await client.request(query);
      return result;
    } catch (error) {
      console.error("Error fetching business:", error);
      return [];
    }
  }
  
  const DeleteItemFromCart = async(id)=>{
    const query = gql`
    mutation DeleteCartItem {
      deleteUserCart(where: {id: "${id}"}) {
        id
      }
    }
    `
    try {
      const result = await client.request(query);
      return result;
    } catch (error) {
      console.error("Error fetching business:", error);
      return [];
    }
  }

  const AddNewReview = async (data) => {
    const query = gql`
      mutation AddNewReview(
        $email: String!
        $profileImage: String!
        $reviewText: String!
        $star: Int!
        $userName: String!
        $restaurantSlug: String!
      ) {
        createReview(
          data: {
            email: $email
            profileImage: $profileImage
            reviewText: $reviewText
            star: $star
            userName: $userName
            restaurant: { connect: { slug: $restaurantSlug } }
          }
        ) {
          id
        }
        publishManyReviewsConnection(to: PUBLISHED) {
          edges {
            node {
              id
            }
          }
        }
      }
    `;
  
    try {
      const result = await client.request(query, {
        email: data.email,
        profileImage: data.profileImage,
        reviewText: data.reviewText, // Do not escape newlines here
        star: data.star,
        userName: data.userName,
        restaurantSlug: data.RestroSlug,
      });
      return result;
    } catch (error) {
      console.error("Error adding review:", error);
      return [];
    }
  };
  
  const getRestaurantReview = async (slug) => {
    const query = gql`
      query RestaurantReviews($slug: String!) {
        reviews(where: { restaurant: { slug: $slug } }, orderBy: publishedAt_DESC) {
          email
          id
          profileImage
          publishedAt
          userName
          star
          reviewText
        }
      }
    `;
  
    try {
      const result = await client.request(query, { slug });
      return result;
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }
  };

  const CreateNewOrder = async (data) =>{
    const query = gql`
    mutation CreateNewOrder {
      createOrder(
        data: {email: "`+data.email+`", 
          orderAmount: `+data.orderAmount+`, 
          restaurantName: "`+data.restaurantName+`", 
          userName: "`+data.userName+`", 
          phone: "`+data.phone+`", 
          address: "`+data.address+`", 
          zipCode: "`+data.zipCode+`"}
      ) {
        id
      }
    }`
    try {
      const result = await client.request(query);
      return result;
    } catch (error) {
      console.error("Error fetching business:", error);
      return [];
    }
  }

  const UpdateOrderToAddOrderItems = async (name, price, id, email) => {
    const query = gql`
      mutation UpdateOrderWithDetail {
        updateOrder(
          data: {
            orderDetail: {
              create: {
                OrderItem: {
                  data: { name: "${name}", price: ${price} }
                }
              }
            }
          }
          where: { id: "${id}" }
        ) {
          id
        }
        publishManyOrdersConnection(to: PUBLISHED) {
          edges {
            node {
              id
            }
          }
        }
        deleteManyUserCartsConnection(where: { email: "${email}" }) {
          edges {
            node {
              id
            }
          }
        }
      }
    `;
  
    try {
      const result = await client.request(query);
      return result;
    } catch (error) {
      console.error("Error fetching order:", error);
      return [];
    }
  };
  const GetEventsGallery = async () => {
    const query = gql`
      query GetEventsGallery {
        eventGalleries {
          image {
            url
          }
        }
      }
    `;
  
    try {
      const result = await client.request(query);
      return result;
    } catch (error) {
      console.error("Error fetching event gallery:", error);
      return { eventGalleries: [] };
    }
  };
  
  const GetEventServices = async () => {
    const query = gql`
      query GetEventServices {
        eventServices {
          image {
            url
          }
        }
      }
    `;
  
    try {
      const result = await client.request(query);
      return result;
    } catch (error) {
      console.error("Error fetching event gallery:", error);
      return { eventGalleries: [] };
    }
  };
  
  const GetEventHero = async () => {
    const query = gql`
      query GetEventHero {
        eventGalleries {
          image {
            url
          }
        }
      }
    `;
  
    try {
      const result = await client.request(query);
      return result;
    } catch (error) {
      console.error("Error fetching event gallery:", error);
      return { eventGalleries: [] };
    }
  };

  const GetUserOrders = async (email)=>{
    const query = gql`
    query UserOrders {
      orders(where: {email: "`+email+`"},orderBy:publishedAt_DESC) {
        address
        createdAt
        email
        id
        orderAmount
        orderDetail {
          ... on OrderItem {
            id
            name
            price
          }
        }
        phone
        restaurantName
        userName
        zipCode
      }
    }`
    try {
      const result = await client.request(query,{email});
      return result;
    } catch (error) {
      console.error("Error fetching event gallery:", error);
      return { orders: [] };
    }
  }
  

export default{
    GetCategory,
    GetRestaurant,
    GetBusinessDetail,
    AddToCart,
    GetUserCart,
    DisconnectRestroFromCartItem,
    DeleteItemFromCart,
    AddNewReview,
    getRestaurantReview,
    CreateNewOrder,
    UpdateOrderToAddOrderItems,
    GetEventsGallery,
    GetEventServices,
    GetEventHero,
    GetUserOrders
}
