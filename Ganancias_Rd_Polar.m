function [GanaR_Pol_0, GanaR_Pol_Anu, GanaR_Pol_Est, GanaR_Pol_Azi, GanaR_Pol_Hor, PorGanaR_Pol_0, PorGanaR_Pol_Anu, PorGanaR_Pol_Est, PorGanaR_Pol_Azi, PorGanaR_Pol_Hor] = Ganancias_Rd_Polar(Radiacion_Rd_Optima, RdOpt_Inv, RdOpt_Pri, RdOpt_Ver, RdOpt_Oto, RdEjePolar, RdEjeAzimutal, RdEjeHorizontal)

%GANANCIAS RESPECTO AL PLANO HORIZONTAL::::::::::::::::::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaR_Pol_0" se almacenan las ganancias de radiación para un
    %seguimiento a un eje polar respecto al plano horizontal. 
    %Ganancia EjePolar_0 = Rdm (Seg. Eje Polar) / Rdm (0) = inf
    
    GanaR_Pol_0 = zeros(1,12);
    
    for i=1:12
    
        GanaR_Pol_0(i)= RdEjePolar(i) / 0;

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaR_Pol_0" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjePolar_0 (%) = ((Rdm (Seg. Eje Polar) / Rdm (0))-1)*100
    
    PorGanaR_Pol_0 = zeros(1,12); 
    
    for j=1:12
   
        PorGanaR_Pol_0(j)= (GanaR_Pol_0(j)-1)*100;
    
    end

%GANANCIAS RESPECTO A LA INCLINACIÓN ÓPTIMA ANUAL::::::::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaR_Pol_Anu" se almacenan las ganancias de radiación para un
    %seguimiento a un eje polar respecto a la inclinación óptima anual. 
    %Ganancia EjePolar_Anu = Rdm (Seg. Eje Polar) / Rdm (Inc Opt Anual)
    
    GanaR_Pol_Anu = zeros(1,12);
    
    for i=1:12
    
        GanaR_Pol_Anu(i)= RdEjePolar(i) / Radiacion_Rd_Optima(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaR_Pol_Anu" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjePolar_Anu (%) = ((Rdm (Seg. Eje Polar) / Rdm (0))-1)*100
    
    PorGanaR_Pol_Anu = zeros(1,12); 
    
    for j=1:12
   
        PorGanaR_Pol_Anu(j)= (GanaR_Pol_Anu(j)-1)*100;
    
    end

%GANANCIAS RESPECTO A LA INCLINACIÓN ÓPTIMA ESTACIONAL:::::::::::::::::::::
%Ya que están en variables independientes las RdOpt de cada estación, se
%almacenan en RadiacionB_optima_Est todos. Pero OJO con diciembre

RadiacionR_optima_Est = zeros(1,12);

RadiacionR_optima_Est(12)= RdOpt_Inv(1); %Diciembre
RadiacionR_optima_Est(1)= RdOpt_Inv(2); %Enero
RadiacionR_optima_Est(2)= RdOpt_Inv(3); %Febero

RadiacionR_optima_Est(3)= RdOpt_Pri(1); %Marzo
RadiacionR_optima_Est(4)= RdOpt_Pri(2); %Abril
RadiacionR_optima_Est(5)= RdOpt_Pri(3); %Mayo

RadiacionR_optima_Est(6)= RdOpt_Ver(1); %Junio
RadiacionR_optima_Est(7)= RdOpt_Ver(2); %Julio
RadiacionR_optima_Est(8)= RdOpt_Ver(3); %Agosto

RadiacionR_optima_Est(9)= RdOpt_Oto(1); %Septiembre
RadiacionR_optima_Est(10)= RdOpt_Oto(2); %Octubre
RadiacionR_optima_Est(11)= RdOpt_Oto(3); %Noviembre

%COCIENTE__________________________________________________________________
    %En "GanaR_Pol_Est" se almacenan las ganancias de radiación para un
    %seguimiento a un eje polar respecto a la inclinación óptima estacional. 
    %Ganancia EjePolar_Est = Rdm (Seg. Eje Polar) / Rdm (Inc Opt Estacional)
    
    GanaR_Pol_Est = zeros(1,12);
    
    for i=1:12
    
        GanaR_Pol_Est(i)= RdEjePolar(i) / RadiacionR_optima_Est(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaR_Pol_Est" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjePolar_Est (%) = ((Rdm (Seg. Eje Polar) / Rdm (Inc Opt Estacional))-1)*100
    
    PorGanaR_Pol_Est = zeros(1,12); 
    
    for j=1:12
   
        PorGanaR_Pol_Est(j)= (GanaR_Pol_Est(j)-1)*100;
    
    end        
     
    
    
%GANANCIAS RESPECTO A UN SEGUIMIENTO A UN EJE AZIMUTAL:::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaD_Pol_Azi" se almacenan las ganancias de radiación para un
    %seguimiento a un eje polar respecto a un seguimiento a un eje azimutal 
    %Ganancia EjePolar_Azi = Rdm (Seg. Eje Polar) / Rdm (Seg. Eje Azimutal)
    
    GanaR_Pol_Azi = zeros(1,12);
    
    for i=1:12
    
        GanaR_Pol_Azi(i)= RdEjePolar(i) / RdEjeAzimutal(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaR_Pol_Azi" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjePolar_Azi (%) = ((Rdm (Seg. Eje Polar) / Rdm (Seg. Eje Azimutal))-1)*100
    
    PorGanaR_Pol_Azi = zeros(1,12); 
    
    for j=1:12
   
        PorGanaR_Pol_Azi(j)= (GanaR_Pol_Azi(j)-1)*100;
    
    end
    
%GANANCIAS RESPECTO A UN SEGUIMIENTO A UN EJE HORIZONTAL:::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaR_Pol_Hor" se almacenan las ganancias de radiación para un
    %seguimiento a un eje polar respecto a un seguimiento a un eje horizontal 
    %Ganancia EjePolar_Hor = Rdm (Seg. Eje Polar) / Rdm (Seg. Eje Horizontal)
    
    GanaR_Pol_Hor = zeros(1,12);
    
    for i=1:12
    
        GanaR_Pol_Hor(i)= RdEjePolar(i) / RdEjeHorizontal(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaR_Pol_Hor" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjePolar_Hor (%) = ((Rdm (Seg. Eje Polar) / Rdm (Seg. Eje Horizontal))-1)*100
    
    PorGanaR_Pol_Hor = zeros(1,12); 
    
    for j=1:12
   
        PorGanaR_Pol_Hor(j)= (GanaR_Pol_Hor(j)-1)*100;
    
    end
end

