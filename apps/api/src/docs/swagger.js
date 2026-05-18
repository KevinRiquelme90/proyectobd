const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "ERP POS Verdulería",
    version: "1.0.0",
    description: "API REST profesional para ERP/POS de venta, inventario y caja"
  },
  servers: [
    {
      url: "http://localhost:4000/api",
      description: "Servidor local"
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },
    schemas: {
      LoginRequest: {
        type: "object",
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string" }
        },
        required: ["email", "password"]
      },
      TokenResponse: {
        type: "object",
        properties: {
          token: { type: "string" },
          refreshToken: { type: "string" },
          user: { $ref: "#/components/schemas/User" }
        }
      },
      User: {
        type: "object",
        properties: {
          _id: { type: "string" },
          nombre: { type: "string" },
          email: { type: "string" },
          role: { type: "object" },
          activo: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        }
      },
      Product: {
        type: "object",
        properties: {
          _id: { type: "string" },
          codigo_barra: { type: "string" },
          nombre: { type: "string" },
          descripcion: { type: "string" },
          precio_compra: { type: "number" },
          precio_venta: { type: "number" },
          stock: { type: "number" },
          stock_minimo: { type: "number" },
          unidad_medida: { type: "string" },
          activo: { type: "boolean" }
        }
      }
    }
  },
  security: [{ bearerAuth: [] }],
  paths: {
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Iniciar sesión",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" }
            }
          }
        },
        responses: {
          "200": { description: "Token de acceso", content: { "application/json": { schema: { $ref: "#/components/schemas/TokenResponse" } } } }
        }
      }
    },
    "/auth/refresh": {
      post: {
        tags: ["Auth"],
        summary: "Refrescar token",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  refreshToken: { type: "string" }
                },
                required: ["refreshToken"]
              }
            }
          }
        },
        responses: {
          "200": { description: "Token renovado", content: { "application/json": { schema: { $ref: "#/components/schemas/TokenResponse" } } } }
        }
      }
    },
    "/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Perfil de usuario",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Usuario conectado", content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } }
        }
      }
    },
    "/products": {
      get: {
        tags: ["Productos"],
        summary: "Listar productos",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Lista de productos" }
        }
      },
      post: {
        tags: ["Productos"],
        summary: "Crear producto",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Product" }
            }
          }
        },
        responses: {
          "201": { description: "Producto creado" }
        }
      }
    }
  }
};

module.exports = swaggerSpec;

