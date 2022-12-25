import { TreeItem } from 'renderer/layout/navigator/components/sidebar/tree/tree';
import { v4 as uuidv4 } from 'uuid';

export const mockTree: TreeItem[] = [
  {
    id: uuidv4(),
    type: 'folder',
    alias: 'Project 1',
    children: [
      {
        id: uuidv4(),
        type: 'folder',
        alias: 'Frontend',
        children: [
          {
            id: uuidv4(),
            type: 'application',
            dataCollectionMode: 'off',
            applicationType: 'SpringBoot',
            alias: 'Frontend Application',
            children: [
              {
                id: uuidv4(),
                type: 'instance',
                dataCollectionMode: 'off',
                alias: 'Frontend Instance 1',
                actuatorUrl: 'http://localhost:8080/actuator',
                parentApplicationId: 'uuid',
              },
              {
                id: uuidv4(),
                type: 'instance',
                dataCollectionMode: 'off',
                alias: 'Frontend Instance 2',
                actuatorUrl: 'http://localhost:8080/actuator',
                parentApplicationId: 'uuid',
              },
            ],
          },
        ],
      },
      {
        id: uuidv4(),
        type: 'folder',
        alias: 'Backend',
        children: [
          {
            id: uuidv4(),
            type: 'application',
            dataCollectionMode: 'off',
            applicationType: 'SpringBoot',
            alias: 'Backend Application',
            children: [
              {
                id: uuidv4(),
                type: 'instance',
                dataCollectionMode: 'off',
                alias: 'Backend Instance',
                actuatorUrl: 'http://localhost:8080/actuator',
                parentApplicationId: 'uuid',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: uuidv4(),
    type: 'folder',
    alias: 'Project 2',
    children: [
      {
        id: uuidv4(),
        type: 'folder',
        alias: 'Project 2 1',
        children: [
          {
            id: uuidv4(),
            type: 'folder',
            alias: 'Project 2 1 1',
            children: [
              {
                id: uuidv4(),
                type: 'folder',
                alias: 'Project 2 1 1 1',
                children: [
                  {
                    id: uuidv4(),
                    type: 'folder',
                    alias: 'Project 2 1 1 1 1',
                    children: [
                      {
                        id: uuidv4(),
                        type: 'folder',
                        alias: 'Project 2 1 1 1 1 1',
                        children: [
                          {
                            id: uuidv4(),
                            type: 'folder',
                            alias: 'Project 2 1 1 1 1 1 1',
                            children: [
                              {
                                id: uuidv4(),
                                type: 'folder',
                                alias: 'Project 2 1 1 1 1 1 1 1',
                                children: [],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  { id: uuidv4(), type: 'folder', alias: 'Project 3', children: [] },
];
