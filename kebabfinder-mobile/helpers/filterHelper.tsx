import { FilterResult } from "@/interfaces/FilterTypes";
import { Kebab, OpeningHour } from "@/interfaces/KebabTypes";

export const getUniqueFilterValues = (kebabs: Kebab[]) => {
    const uniqueMeatTypes = getUniqueMeatTypes(kebabs);
  
    const uniqueSauces = getUniqueSauces(kebabs);

    const uniqueStatuses = getUniqueStatuses(kebabs);

    const uniqueBuildingTypes = getUniqueBuildingTypes(kebabs);
  
    return { uniqueMeatTypes, uniqueSauces, uniqueStatuses, uniqueBuildingTypes };
  };

const getUniqueMeatTypes = (kebabs: Kebab[]) =>{
    return Array.from(
        new Set(kebabs.flatMap((kebab) => kebab.meat_types.map((meat) => meat.name)))
      );
}

const getUniqueSauces = (kebabs: Kebab[]) =>{
    return Array.from(
        new Set(kebabs.flatMap((kebab) => kebab.sauces.map((sauce) => sauce.name)))
      );
}

const getUniqueStatuses = (kebabs: Kebab[]) => {
    return Array.from(new Set(kebabs.map((kebab) => kebab.status)));
  };

const getUniqueBuildingTypes = (kebabs: Kebab[]) => {
  return Array.from(new Set(kebabs.map((kebab) => kebab.building_type)));
};

export const filterKebabs = (kebabs: Kebab[], filterResult: FilterResult) => {
  var filteredKebabs = filterByMeats(kebabs, filterResult);
  filteredKebabs = filterBySauces(filteredKebabs, filterResult);
  filteredKebabs = filterByStatuses(filteredKebabs, filterResult);
  filteredKebabs = filterByBuildingTypes(filteredKebabs, filterResult);
  filteredKebabs = filterByCraft(filteredKebabs, filterResult);
  filteredKebabs = filterByChain(filteredKebabs, filterResult);
  filteredKebabs = filterByHasApp(filteredKebabs, filterResult);
  filteredKebabs = filterByHasPhone(filteredKebabs, filterResult);
  filteredKebabs = filterByHasWebsite(filteredKebabs, filterResult);
  filteredKebabs = filterByDayOfWeek(filteredKebabs, filterResult);
  return filteredKebabs;
}

const filterByMeats = (kebabs: Kebab[], filterResult: FilterResult) => {
  return kebabs.filter((kebab) =>
    (filterResult.filterSelectedMeats.length === 0 || kebab.meat_types.some((m) => filterResult.filterSelectedMeats.includes(m.name))));
}

const filterBySauces = (kebabs: Kebab[], filterResult: FilterResult) => {
  return kebabs.filter((kebab) =>
    (filterResult.filterSelectedSauces.length === 0 || kebab.sauces.some((s) => filterResult.filterSelectedSauces.includes(s.name))));
}

const filterByStatuses = (kebabs: Kebab[], filterResult: FilterResult) => {
  return kebabs.filter((kebab) =>
    (filterResult.filterSelectedStatuses.length === 0 || filterResult.filterSelectedStatuses.includes(kebab.status)));
}

const filterByBuildingTypes = (kebabs: Kebab[], filterResult: FilterResult) => {
  return kebabs.filter((kebab) =>
    (filterResult.filterSelectedBuildingTypes.length === 0 || filterResult.filterSelectedBuildingTypes.includes(kebab.building_type)));
}

const filterByCraft = (kebabs: Kebab[], filterResult: FilterResult) => {
  return kebabs.filter((kebab) =>
    (filterResult.filterIsCraft == null || filterResult.filterIsCraft == kebab.is_craft));
}

const filterByChain = (kebabs: Kebab[], filterResult: FilterResult) => {
  return kebabs.filter((kebab) =>
    (filterResult.filterIsChain == null || filterResult.filterIsChain == kebab.is_chain));
}

const filterByHasApp = (kebabs: Kebab[], filterResult: FilterResult) => {
  if (filterResult.filterHasApp == null) {
    return kebabs; 
  }
  return kebabs.filter((kebab) => {
    const hasApp = kebab.order_way.some(
      (orderWay) => orderWay.app_name?.trim().length > 0 
    );
    return filterResult.filterHasApp ? hasApp : !hasApp;
  });
};

const filterByHasPhone = (kebabs: Kebab[], filterResult: FilterResult) => {
  if (filterResult.filterHasPhone == null) {
    return kebabs; 
  }
  return kebabs.filter((kebab) => {
    const hasPhone = kebab.order_way.some(
      (orderWay) => orderWay.phone_number?.trim().length > 0 
    );
    return filterResult.filterHasPhone ? hasPhone : !hasPhone;
  });
};

const filterByHasWebsite = (kebabs: Kebab[], filterResult: FilterResult) => {
  if (filterResult.filterHasWebsite == null) {
    return kebabs; 
  }
  return kebabs.filter((kebab) => {
    const hasWebiste = kebab.order_way.some(
      (orderWay) => orderWay.website?.trim().length > 0 
    );
    return filterResult.filterHasWebsite ? hasWebiste : !hasWebiste;
  });

};

const filterByDayOfWeek = (kebabs: Kebab[], filterResult: FilterResult) => {
  var tmpKebab = kebabs;
  if(filterResult.filterDayOfWeek.monday_open != null && filterResult.filterDayOfWeek.monday_open != ""){
    tmpKebab = kebabs.filter((kebab) => {
      return kebab.opening_hour?.monday_open == filterResult.filterDayOfWeek.monday_open
    })
  }

  if(filterResult.filterDayOfWeek.monday_close != null && filterResult.filterDayOfWeek.monday_close != ""){
    tmpKebab = tmpKebab.filter((kebab) => {
      return kebab.opening_hour?.monday_close == filterResult.filterDayOfWeek.monday_close
    })
  }

  if(filterResult.filterDayOfWeek.tuesday_open != null && filterResult.filterDayOfWeek.tuesday_open != ""){
    tmpKebab = tmpKebab.filter((kebab) => {
      return kebab.opening_hour?.tuesday_open == filterResult.filterDayOfWeek.tuesday_open
    })
  }

  if(filterResult.filterDayOfWeek.tuesday_close != null && filterResult.filterDayOfWeek.tuesday_close != ""){
    tmpKebab = tmpKebab.filter((kebab) => {
      return kebab.opening_hour?.tuesday_close == filterResult.filterDayOfWeek.tuesday_close
    })
  }

  if(filterResult.filterDayOfWeek.wednesday_open != null && filterResult.filterDayOfWeek.wednesday_open != ""){
    tmpKebab = tmpKebab.filter((kebab) => {
      return kebab.opening_hour?.wednesday_open == filterResult.filterDayOfWeek.wednesday_open
    })
  }

  if(filterResult.filterDayOfWeek.wednesday_close != null && filterResult.filterDayOfWeek.wednesday_close != ""){
    tmpKebab = tmpKebab.filter((kebab) => {
      return kebab.opening_hour?.wednesday_close == filterResult.filterDayOfWeek.wednesday_close
    })
  }

  if(filterResult.filterDayOfWeek.thursday_open != null && filterResult.filterDayOfWeek.thursday_open != ""){
    tmpKebab = tmpKebab.filter((kebab) => {
      return kebab.opening_hour?.thursday_open == filterResult.filterDayOfWeek.thursday_open
    })
  }

  if(filterResult.filterDayOfWeek.thursday_close != null && filterResult.filterDayOfWeek.thursday_close != ""){
    tmpKebab = tmpKebab.filter((kebab) => {
      return kebab.opening_hour?.thursday_close == filterResult.filterDayOfWeek.thursday_close
    })
  }

  if(filterResult.filterDayOfWeek.friday_open != null && filterResult.filterDayOfWeek.friday_open != ""){
    tmpKebab = tmpKebab.filter((kebab) => {
      return kebab.opening_hour?.friday_open == filterResult.filterDayOfWeek.friday_open
    })
  }

  if(filterResult.filterDayOfWeek.friday_close != null && filterResult.filterDayOfWeek.friday_close != ""){
    tmpKebab = tmpKebab.filter((kebab) => {
      return kebab.opening_hour?.friday_close == filterResult.filterDayOfWeek.friday_close
    })
  }

  if(filterResult.filterDayOfWeek.saturday_open != null && filterResult.filterDayOfWeek.saturday_open != ""){
    tmpKebab = tmpKebab.filter((kebab) => {
      return kebab.opening_hour?.saturday_open == filterResult.filterDayOfWeek.saturday_open
    })
  }

  if(filterResult.filterDayOfWeek.saturday_close != null && filterResult.filterDayOfWeek.saturday_close != ""){
    tmpKebab = tmpKebab.filter((kebab) => {
      return kebab.opening_hour?.saturday_close == filterResult.filterDayOfWeek.saturday_close
    })
  }

  if(filterResult.filterDayOfWeek.sunday_open != null && filterResult.filterDayOfWeek.sunday_open != ""){
    tmpKebab = tmpKebab.filter((kebab) => {
      return kebab.opening_hour?.sunday_open == filterResult.filterDayOfWeek.sunday_open
    })
  }

  if(filterResult.filterDayOfWeek.sunday_close != null && filterResult.filterDayOfWeek.sunday_close != ""){
    tmpKebab = tmpKebab.filter((kebab) => {
      return kebab.opening_hour?.sunday_close == filterResult.filterDayOfWeek.sunday_close
    })
  }

  return tmpKebab;
};

export const resetDaysOfWeek = (openingHours: OpeningHour) => {
  var tmpOpeningHour = openingHours;
  tmpOpeningHour.monday_open = null;
  tmpOpeningHour.monday_close = null;
  tmpOpeningHour.tuesday_open = null;
  tmpOpeningHour.tuesday_close = null;
  tmpOpeningHour.wednesday_open = null;
  tmpOpeningHour.wednesday_close = null;
  tmpOpeningHour.thursday_open = null;
  tmpOpeningHour.thursday_close = null;
  tmpOpeningHour.friday_open = null;
  tmpOpeningHour.friday_close = null;
  tmpOpeningHour.saturday_open = null;
  tmpOpeningHour.saturday_close = null;
  tmpOpeningHour.sunday_open = null;
  tmpOpeningHour.sunday_close = null;
  return tmpOpeningHour;
}