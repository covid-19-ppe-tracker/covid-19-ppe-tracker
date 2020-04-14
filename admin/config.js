const models = require('../models');
const AdminBro = require('admin-bro');
const AdminBroSequelize = require('admin-bro-sequelizejs');

AdminBro.registerAdapter(AdminBroSequelize);

module.exports = {
  databases: [models],
  rootPath: '/admin',
  branding: {
    companyName: 'COVID-19 PPE Tracker'
  },
  resources: [{
    resource: models.User,
    options: {
      properties: {
        password: {
          type: 'string',
          isVisible: {
            list: false, edit: true, filter: false, show: false,
          },
        },
      },
      actions: {
        new: {
          before: async (request) => {
            if (request.payload.password) {
              request.payload.password = await argon2.hash(request.payload.password);
            }
            return request;
          },
        }
      }
    }
  },
  {
    resource: models.Proof,
    options: {
      actions: {
        documents: {
          actionType: 'record',
          icon: 'View',
          isVisible: true,
          isAccessible: true,
          handler: async (req, res, context) => {
            let proof = context.record;
            const DocumentResource = context._admin.findResource('Documents')
            const docs = await models.Document.findAll({ where: { ProofId: proof.params.id } });
            const documentRecords = await DocumentResource.findMany(docs.map(it => it.id));
            proof.populate('documents', {
              records: documentRecords,
              toJSON: function () {
                return this.records.map(it => it.toJSON());
              }
            });
            return {
              record: proof.toJSON()
            }
          },
          component: AdminBro.bundle('./view-proof-documents.component.jsx'),
        },
      },
    },
  },
  {
    resource: models.Availability,
    options: {
      actions: {
        edit: {
          before: async (req) => {
            if (!req.payload.connected) {
              req.payload.connected = false;
            }
            if (!req.payload.resolved) {
              req.payload.resolved = false;
            }
            return req;
          }
        }
      }
    }
  },
  {
    resource: models.Requirement,
    options: {
      actions: {
        edit: {
          before: async (req) => {
            if (!req.payload.canBuy) {
              req.payload.canBuy = false;
            }
            if (!req.payload.connected) {
              req.payload.connected = false;
            }
            if (!req.payload.resolved) {
              req.payload.resolved = false;
            }
            return req;
          }
        }
      }
    }
  },
  {
    resource: models.Manufacturing,
    options: {
      actions: {
        edit: {
          before: async (req) => {
            if (!req.payload.connected) {
              req.payload.connected = false;
            }
            if (!req.payload.resolved) {
              req.payload.resolved = false;
            }
            return req;
          }
        }
      }
    }
  },


  ],
}
