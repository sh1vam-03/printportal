import RequestTable from "../../components/RequestTable";
import Card from "../../components/ui/Card";

const PrintDashboard = () => {
    return (
        <div className="animate-fade-in-up space-y-6">
            <Card title="Printing Jobs">
                <RequestTable
                    role="PRINTING"
                    fetchQueryRole=""
                    filterFn={(req) => ["APPROVED", "IN_PROGRESS"].includes(req.status)}
                />
            </Card>
        </div>
    );
};

export default PrintDashboard;
