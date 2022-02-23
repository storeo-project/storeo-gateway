import { processConfig } from "@graphql-mesh/config";

const {ApolloServer} = require('apollo-server')
const {getMesh} = require('@graphql-mesh/runtime')

async function main() {
    const parsedConfig = await processConfig({
        sources: [
            {
                name: "Common Service",
                handler: {
                    openapi: {
                        source: `http://${process.env.COMMON_SERVICE}:8080/openapi.yaml`,
                        baseUrl: `http://${process.env.COMMON_SERVICE}:8080`,
                        operationIdFieldNames: true
                    }
                }
            },
            {
                name: "Shop Service",
                handler: {
                    openapi: {
                        source: `http://${process.env.SHOP_SERVICE}:8080/openapi.yaml`,
                        baseUrl: `http://${process.env.SHOP_SERVICE}:8080`,
                        operationIdFieldNames: true
                    }
                }
            },
        ]
    }, {
        dir: '.'
    });

    const {schema, contextBuilder: context} = await getMesh(parsedConfig);

    const apolloServer = new ApolloServer({
        schema,
        context,
    });

    const {url} = await apolloServer.listen(4000);
    console.info(`🚀 Server ready at ${url}`);
}

main().catch(err => console.error(err));
