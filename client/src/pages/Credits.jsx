import { useEffect, useState } from "react";
import Loading from "./Loading";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

function Credits() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, axios } = useAppContext();
  const fetchPlans = async () => {
    try {
      const { data } = await axios.get("/api/credit/plan", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setPlans(data.plans);
      } else {
        toast.error(data.message || "Failed to fetch plans.");
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const purchasePlan = async (planId) => {
    try {
      const { data } = await axios.post(
        "/api/credit/purchase",
        { planId },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (data.success) {
        window.location.href = data.url;
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    fetchPlans();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl h-screen overflow-y-auto mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl sm:text-4xl font-semibold text-center mb-12 text-gray-800 dark:text-white">
        Credit Plans
      </h2>

      <div className="flex flex-wrap justify-center gap-8">
        {plans.map((plan) => (
          <div
            key={plan._id}
            className={`
              w-72 rounded-2xl p-6 transition-all duration-300
              shadow-md hover:shadow-xl hover:-translate-y-1
              border border-gray-200 dark:border-gray-700
              backdrop-blur-lg
              ${
                plan._id === "pro"
                  ? "bg-purple-50 dark:bg-purple-900/40 border-purple-300 dark:border-purple-600"
                  : "bg-white dark:bg-gray-900/40"
              }
            `}
          >
            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                {plan.name}
              </h3>

              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                ${plan.price}
                <span className="text-sm font-normal text-gray-500 ml-1">
                  /{plan.credits} credits
                </span>
              </p>

              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="text-green-500">✔</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() =>
                toast.promise(purchasePlan(plan._id), {
                  loading: "Processing...",
                })
              }
              className={`
                  mt-6 w-full py-2 rounded-lg font-medium transition-all
                  ${
                    plan._id === "pro"
                      ? "bg-purple-600 hover:bg-purple-700 text-white"
                      : "bg-gray-800 hover:bg-gray-900 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200"
                  }
                `}
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Credits;
