export default function HeatmapCalendar() {

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg">

      <h2 className="font-bold text-xl mb-6">
        Activity Heatmap
      </h2>

      <div className="grid grid-cols-7 gap-2">

        {[...Array(35)].map((_, index) => (

          <div
            key={index}
            className="
              w-8
              h-8
              rounded-md
              bg-orange-300
            "
          />

        ))}

      </div>

    </div>
  );
}