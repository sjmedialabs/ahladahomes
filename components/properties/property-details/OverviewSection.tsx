"use client";

export default function OverviewSection({ data }: any) {

    // -------------------------------------------
    // PROPERTY TYPE BASED CONFIGURATION BLOCKS
    // -------------------------------------------

    const renderConfig = () => {
        switch (data.type) {

            /* =====================
               🏢 APARTMENT
            ======================*/
            case "apartment":
                return (
                    <>
                        <InfoBlock
                            label="Configuration"
                            value={data.apartmentDetails?.bhkType || "N/A"}
                        />
                        <div className="w-[1px] bg-gray-200"></div>
                        <InfoBlock
                            label="Floors"
                            value={
                                data.apartmentDetails?.towers?.length
                                    ? `${data.apartmentDetails.floorsPerTower || "N/A"} Floors`
                                    : `${data.apartmentDetails?.totalUnits || "N/A"} Floors`
                            }
                        />
                        <div className="w-[1px] bg-gray-200"></div>
                        <InfoBlock
                            label="Possession"
                            value={data.possession || "N/A"}
                        />
                    </>
                );

            /* =====================
               🏠 VILLA
            ======================*/
            case "villa":
                return (
                    <>
                        <InfoBlock
                            label="Villa Type"
                            value={data.villaDetails?.villaType || "N/A"}
                        />
                        <div className="w-[1px] bg-gray-200"></div>
                        <InfoBlock
                            label="Built-Up Area"
                            value={`${data.villaDetails?.builtUpArea || "N/A"} sq.ft`}
                        />
                        <div className="w-[1px] bg-gray-200"></div>
                        <InfoBlock
                            label="Possession"
                            value={data.possession || "N/A"}
                        />
                    </>
                );

            /* =====================
               🏬 COMMERCIAL
            ======================*/
            case "commercial":
                return (
                    <>
                        <InfoBlock
                            label="Usage"
                            value={data.commercialDetails?.propertyUsage || "N/A"}
                        />
                        <div className="w-[1px] bg-gray-200"></div>
                        <InfoBlock
                            label="Carpet Area"
                            value={`${data.commercialDetails?.carpetArea || "N/A"} sq.ft`}
                        />
                        <div className="w-[1px] bg-gray-200"></div>
                        <InfoBlock
                            label="Floor No."
                            value={data.commercialDetails?.floorNumber || "N/A"}
                        />
                    </>
                );

            /* =====================
               🏞 OPEN PLOT
            ======================*/
            case "open-plot":
                return (
                    <>
                        <InfoBlock
                            label="Plot Size"
                            value={`${data.plotDetails?.plotSize || "N/A"} sq.yards`}
                        />
                        <div className="w-[1px] bg-gray-200"></div>
                        <InfoBlock
                            label="Dimensions"
                            value={
                                data.plotDetails?.plotDimensions
                                    ? `${data.plotDetails.plotDimensions.length}m × ${data.plotDetails.plotDimensions.width}m`
                                    : "N/A"
                            }
                        />
                        <div className="w-[1px] bg-gray-200"></div>
                        <InfoBlock
                            label="Soil Type"
                            value={data.plotDetails?.soilType || "N/A"}
                        />
                    </>
                );

            /* =====================
               🌾 FARM LAND
            ======================*/
            case "farm-land":
                return (
                    <>
                        <InfoBlock
                            label="Total Area"
                            value={`${data.farmLandDetails?.totalArea || "N/A"} acres`}
                        />
                        <div className="w-[1px] bg-gray-200"></div>
                        <InfoBlock
                            label="Soil Type"
                            value={data.farmLandDetails?.soilType || "N/A"}
                        />
                        <div className="w-[1px] bg-gray-200"></div>
                        <InfoBlock
                            label="Water Source"
                            value={data.farmLandDetails?.waterSource || "N/A"}
                        />
                    </>
                );

            default:
                return null;
        }
    };
    // -------------------------------------------
    // AUTO-GENERATED HIGHLIGHTS BASED ON PROPERTY TYPE
    // -------------------------------------------
const generateHighlights = () => {
  switch (data.type) {
    case "apartment":
      return [
        data.apartmentDetails?.bathrooms && {
          label: "Unit Size",
          value: `${data.area} sq.ft`,
        },
        data.apartmentDetails?.balconies && {
          label: "Total Balconies",
          value: data.apartmentDetails.balconies,
        },
        data.apartmentDetails?.totalUnits && {
          label: "Total Units",
          value: data.apartmentDetails.totalUnits,
        },
        data.apartmentDetails?.towers && {
          label: "Total Towers",
          value: data.apartmentDetails.towers,
        },
        data.apartmentDetails?.floorsPerTower && {
          label: "Floors per Tower",
          value: data.apartmentDetails.floorsPerTower,
        },
        data.furnished && {
          label: "Furnished Status",
          value: data.furnished,
        },
        data.apartmentDetails?.bhkType && {
          label: "BHK Type",
          value: `${data.apartmentDetails.bhkType} Apartment`,
        },
        data.apartmentDetails?.possessionDate && {
          label: "Possession",
          value: data.apartmentDetails.possessionDate,
        },
      ].filter(Boolean);

    case "villa":
      return [
        data.villaDetails?.gardenArea && {
          label: "Garden Area",
          value: data.villaDetails.gardenArea,
        },
        data.villaDetails?.plotArea && {
          label: "Plot Area",
          value: `${data.villaDetails.plotArea} sq.ft`,
        },
        data.villaDetails?.parkingSpaces && {
          label: "Parking Spaces",
          value: data.villaDetails.parkingSpaces,
        },
        data.villaDetails?.gatedCommunity && {
          label: "Gated Community",
          value: "Yes",
        },
        data.villaDetails?.numberOfFloors && {
          label: "No. of Floors",
          value: data.villaDetails.numberOfFloors,
        },
        data.villaDetails?.villaType && {
          label: "Villa Type",
          value: data.villaDetails.villaType,
        },
        data.villaDetails?.builtUpArea && {
          label: "Built-up Area",
          value: `${data.villaDetails.builtUpArea} sq.ft`,
        },
        data.villaDetails?.bedrooms && {
          label: "Bedrooms",
          value: data.villaDetails.bedrooms,
        },
      ].filter(Boolean);

    case "commercial":
      return [
        data.commercialDetails?.superBuiltupArea && {
          label: "Super Built-up",
          value: `${data.commercialDetails.superBuiltupArea} sq.ft`,
        },
        data.commercialDetails?.parkingAvailable && {
          label: "Parking",
          value: "Available",
        },
        data.commercialDetails?.ceilingHeight && {
          label: "Ceiling Height",
          value: `${data.commercialDetails.ceilingHeight} ft`,
        },
        data.commercialDetails?.facingRoadWidth && {
          label: "Road Width",
          value: `${data.commercialDetails.facingRoadWidth} ft`,
        },
        data.commercialDetails?.propertyUsage && {
          label: "Usage",
          value: data.commercialDetails.propertyUsage,
        },
        data.commercialDetails?.carpetArea && {
          label: "Carpet Area",
          value: `${data.commercialDetails.carpetArea} sq.ft`,
        },
      ].filter(Boolean);

    case "open-plot":
      return [
        data.plotDetails?.roadWidth && {
          label: "Road Width",
          value: `${data.plotDetails.roadWidth}m`,
        },
        data.plotDetails?.plotType && {
          label: "Plot Type",
          value: `${data.plotDetails.plotType} plot`,
        },
        data.plotDetails?.cornerPlot && {
          label: "Corner Plot",
          value: "Yes",
        },
        data.plotDetails?.plotSize && {
          label: "Possession",
          value: `${data.possession}`,
        },
        data.plotDetails?.approvals?.length && {
          label: "Approvals",
          value: data.plotDetails.approvals.join(", "),
        },
        data.plotDetails?.soilType && {
          label: "Soil Type",
          value: data.plotDetails.soilType,
        },
      ].filter(Boolean);

    case "farm-land":
      return [
        data.farmLandDetails?.landDimensions && {
          label: "Dimensions",
          value: `${data.farmLandDetails.landDimensions.length}m × ${data.farmLandDetails.landDimensions.width}m`,
        },
        data.farmLandDetails?.irrigation && {
          label: "Irrigation",
          value: data.farmLandDetails.irrigation,
        },
        data.farmLandDetails?.plantationType && {
          label: "Field type",
          value: data.farmLandDetails.plantationType,
        },
        data.farmLandDetails?.fencing && {
          label: "Fencing Type",
          value: `${data.farmLandDetails.fencing}`,
        },
        data.farmLandDetails?.soilType && {
          label: "Soil Type",
          value: data.farmLandDetails.soilType,
        },
        data.farmLandDetails?.waterSource && {
          label: "Water Source",
          value: data.farmLandDetails.waterSource,
        },
      ].filter(Boolean);

    default:
      return [];
  }
};


    const highlights = generateHighlights();

    // -------------------------------------------
    // COMPONENT UI
    // -------------------------------------------

    return (
        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3">

            {/* LEFT PANEL */}
            <div className="lg:col-span-2 px-8 py-4">

                {/* ABOUT PROJECT */}
                <h3 className="text-xl font-bold mb-4">About Project</h3>

                <p className="text-gray-500 text-justify line-clamp-6 text-sm mb-6">
                    {data.description}
                </p>

                {/* AUTO-GENERATED HIGHLIGHTS */}
                {highlights.length > 0 && (
                    <div className="flex gap-4 flex-wrap mt-4 capitalize">
                        {highlights.slice(0, 4).map((h: any, i: number) => (
                            <div
                                key={i}
                                className="bg-gold4 text-greenTheme px-10 py-2 rounded-lg font-semibold shadow flex flex-col gap-1 text-center items-center"
                            >
                            <span>{h.label}</span>    {h.value} 
                            </div>
                        ))}
                    </div>
                )}


                {/* INFO CARDS (Dynamic by Type) */}
                <div className="mt-8 flex flex-wrap justify-between gap-10 pr-8 capitalize">
                    {renderConfig()}
                </div>

            </div>

            {/* RIGHT IMAGE */}
            <div className="flex items-center justify-center">
                <img
                    src={data.images?.[0] || "/placeholder.svg"}
                    className="lg:w-full h-full lg:h-fit shadow-lg"
                />
            </div>
        </div>
    );
}

/* -------------------------------------------
   SMALL REUSABLE BLOCK COMPONENT
------------------------------------------- */
function InfoBlock({ label, value }: { label: string; value: any }) {
    return (
        <div className="px-4 py-2">
            <p className="text-2xl font-bold capitalize">{value}</p>
            <p className="text-gray-500 text-sm">{label}</p>
        </div>
    );
}
