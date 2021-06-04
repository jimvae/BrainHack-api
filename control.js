// heroke database
// export const connectionString = {
//         // connecting to database
//         client: 'pg',
//         // pg for postgresql
//         connection: {
//           connectionString : process.env.DATABASE_URL,
//         //   same as local host
//         ssl: {
//             rejectUnauthorized: false,
//             },
//         }
// }

// local database
// remember to run local database
export const connectionString = {
    // connecting to database
    client: 'pg',
    // pg for postgresql
    connection: {
      host : '127.0.0.1',
    //   same as local host
      user : 'jimvincent',
      password : '',
      database : 'brainhack'
    }
};