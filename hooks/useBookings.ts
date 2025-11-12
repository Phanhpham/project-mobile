import { getBookingsByRoomId } from "@/apis/apiBooking";
import { useQuery } from "@tanstack/react-query";

export const useBookedDates = (roomId: number) => {
    return useQuery({
      queryKey: ["bookedDates", roomId],
      queryFn: async () => {
        return await getBookingsByRoomId(roomId);
      },
      enabled: !!roomId,
      refetchOnWindowFocus: false, 
      refetchOnReconnect: false,
    });
  }