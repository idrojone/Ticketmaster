async function testRoutes (server: any, options: any) {

    server.get('/test', async (request: any, reply: any) => {
        return { message: 'Test route is working!' };
    });
}

export default { testRoutes };