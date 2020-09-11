import { StringMap } from "aws-sdk/clients/ecs";

/**
 * Fields in a request to create a single TODO item.
 */
export interface CreateTodoRequest {
  name: string
  dueDate: string,
  done: boolean,
  createdAt: string
}
