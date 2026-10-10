function [GanaR_2Ej_0, GanaR_2Ej_Anu, GanaR_2Ej_Est, GanaR_2Ej_Pol, GanaR_2Ej_Azi, GanaR_2Ej_Hor, PorGanaR_2Ej_0, PorGanaR_2Ej_Anu, PorGanaR_2Ej_Est, PorGanaR_2Ej_Pol, PorGanaR_2Ej_Azi, PorGanaR_2Ej_Hor] = Ganancias_Rd_2Ejes(Radiacion_Rd_Optima, RdOpt_Inv, RdOpt_Pri, RdOpt_Ver, RdOpt_Oto, RdEjePolar, RdEjeAzimutal, RdEjeHorizontal, Rd2Ejes)

%GANANCIAS RESPECTO AL PLANO HORIZONTAL::::::::::::::::::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaR_2Ej_0" se almacenan las ganancias de radiación para un
    %seguimiento a dos ejes respecto al plano horizontal. 
    %Ganancia 2Ejes_0 = Rdm (Seg. 2 Ejes) / Rdm (0)
    
    GanaR_2Ej_0 = zeros(1,12);
    
    for i=1:12
    
        GanaR_2Ej_0(i)= Rd2Ejes(i) / 0;

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaR_2Ej_0" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia 2Ejes_0 (%) = ((Rdm (Seg. 2 Ejes) / Rdm (0))-1)*100
    
    PorGanaR_2Ej_0 = zeros(1,12); 
    
    for j=1:12
   
        PorGanaR_2Ej_0(j)= (GanaR_2Ej_0(j)-1)*100;
    
    end
    
%GANANCIAS RESPECTO A LA INCLINACIÓN ÓPTIMA ANUAL::::::::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaR_2Ej_Anu" se almacenan las ganancias de radiación para un
    %seguimiento a 2 ejes respecto a la inclinación óptima anual. 
    %Ganancia 2Ejes_Anu  = Rdm (Seg. 2 Ejes) / Rdm (Inc Opt Anual)
    
    GanaR_2Ej_Anu = zeros(1,12);
    
    for i=1:12
    
        GanaR_2Ej_Anu(i)= Rd2Ejes(i) / Radiacion_Rd_Optima(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaR_Pol_Anu" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia 2Ejes_Anu(%) = ((Rdm (Seg. 2 Ejes) / Rdm (Inc Opt Anual))-1)*100
    
    PorGanaR_2Ej_Anu = zeros(1,12); 
    
    for j=1:12
   
        PorGanaR_2Ej_Anu(j)= (GanaR_2Ej_Anu(j)-1)*100;
    
    end

%GANANCIAS RESPECTO A LA INCLINACIÓN ÓPTIMA ESTACIONAL:::::::::::::::::::::
%Ya que están en variables independientes las RdOpt de cada estación, se
%almacenan en RadiacionG_optima_Est todos. Pero OJO con diciembre

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
    %En "GanaR_2Ej_Est" se almacenan las ganancias de radiación para un
    %seguimiento a 2 ejes respecto a la inclinación óptima estacional. 
    %Ganancia 2Ejes_Est = Rdm (Seg. 2 Ejes) / Rdm (Inc Opt Estacional)
    
    GanaR_2Ej_Est = zeros(1,12);
    
    for i=1:12
    
        GanaR_2Ej_Est(i)= Rd2Ejes(i) / RadiacionR_optima_Est(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaR_2Ej_Est" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia 2Ejes_Est (%) = ((Rdm (Seg. 2 Ejes) / Rdm (Inc Opt Estacional))-1)*100
    
    PorGanaR_2Ej_Est = zeros(1,12); 
    
    for j=1:12
   
        PorGanaR_2Ej_Est(j)= (GanaR_2Ej_Est(j)-1)*100;
    
    end    
    
%GANANCIAS RESPECTO A UN SEGUIMIENTO A UN EJE POLAR:::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaR_2Ej_Pol" se almacenan las ganancias de radiación para un
    %seguimiento a 2 ejes respecto a un seguimiento a un eje polar
    %Ganancia 2Ejes_Pol = Rdm (Seg. 2 Ejes) / Rdm (Seg. Eje Polar)
    
    GanaR_2Ej_Pol = zeros(1,12);
    
    for i=1:12
    
        GanaR_2Ej_Pol(i)= Rd2Ejes(i) / RdEjePolar(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaR_2Ej_Pol" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia 2Ejes_Pol (%) = ((Rdm (Seg. 2 Ejes) / Rdm (Seg. Eje Polar))-1)*100
    
    PorGanaR_2Ej_Pol = zeros(1,12); 
    
    for j=1:12
   
        PorGanaR_2Ej_Pol(j)= (GanaR_2Ej_Pol(j)-1)*100;
    
    end
    
    
    
%GANANCIAS RESPECTO A UN SEGUIMIENTO A UN EJE AZIMUTAL:::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaR_2Ej_Azi" se almacenan las ganancias de radiación para un
    %seguimiento a 2 ejes respecto a un seguimiento a un eje azimutal 
    %Ganancia 2Ejes_Azi = Rdm (Seg. 2 Ejes) / Rdm (Seg. Eje Azimutal)
    
    GanaR_2Ej_Azi = zeros(1,12);
    
    for i=1:12
    
        GanaR_2Ej_Azi(i)= Rd2Ejes(i) / RdEjeAzimutal(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaR_2Ej_Azi" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia 2Ejes_Azi(%) = ((Rdm (Seg. 2 Ejes) / Rdm (Seg. Eje Azimutal))-1)*100
    
    PorGanaR_2Ej_Azi = zeros(1,12); 
    
    for j=1:12
   
        PorGanaR_2Ej_Azi(j)= (GanaR_2Ej_Azi(j)-1)*100;
    
    end
    
%GANANCIAS RESPECTO A UN SEGUIMIENTO A UN EJE HORIZONTAL:::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaR_2Ej_Hor" se almacenan las ganancias de radiación para un
    %seguimiento a 2 ejes respecto a un seguimiento a un eje horizontal 
    %Ganancia 2Ejes_Hor = Rdm (Seg. 2 Ejes) / Rdm (Seg. Eje Horizontal)
    
    GanaR_2Ej_Hor = zeros(1,12);
    
    for i=1:12
    
        GanaR_2Ej_Hor(i)= Rd2Ejes(i) / RdEjeHorizontal(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaR_2Ej_Hor" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia 2Ejes_Hor (%) = ((Rdm (Seg. 2 Ejes) / Rdm (Seg. Eje Horizontal))-1)*100
    
    PorGanaR_2Ej_Hor = zeros(1,12); 
    
    for j=1:12
   
        PorGanaR_2Ej_Hor(j)= (GanaR_2Ej_Hor(j)-1)*100;
    
    end


end

