import React from "react";



import { List, Switch, Typography } from "antd";



import { IFlight } from "@/lib/models/flight.model";
import { updateFlight, updateFlightThunk } from "@/lib/state/flights/flights.slice";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";


const { Text } = Typography;

interface FlightChecklistProps {
  checklist: {
    [key: string]: boolean | any; // To handle boolean values and other types like arrays (e.g., `adminNotes`)
  };
}

const FlightChecklist: React.FC<FlightChecklistProps> = ({ checklist }) => {
  // Exclude non-boolean fields like "adminNotes" if needed
  const checklistItems = Object.entries(checklist).filter(
    ([key, value]) => typeof value === "boolean"
  );

  const selectedFlight = useAppSelector((state) => state.flights.selectedFlight as IFlight)
  const dispatch = useAppDispatch()

  return (
    <div>
      <List
        bordered
        dataSource={checklistItems}
        renderItem={([key, value]) => (
          <List.Item>
            <Text>{key}</Text>
            <Switch defaultValue={value} onChange={() => {
              // Update the checklist state here
              dispatch(
                updateFlightThunk({
                  id: selectedFlight._id,
                  data: {
                    checklist: { ...selectedFlight.checklist, [key]: !value },
                  },
                })
              );
            }} />
          </List.Item>
        )}
      />
    </div>
  );
};

export default FlightChecklist;