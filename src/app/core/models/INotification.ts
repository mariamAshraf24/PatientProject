export interface notification {
  id:number,
  message: string;
  type: number;
  doctorName: string;
}

export interface NotificationResponse {
  success: boolean;
  message: string;
  data: notification[];
  errors: any;
}