function [Gdm_representar, media, angulo_optimo, Radiacion_optima, suma_angulo_optimo]= Calculos_optimo (GdBetaTotal, DATOS)

%--------------------------------------------------------------------------
%En "Gdm_representar" se encuentran las radiaciones Gdm para cada inclinación a mostrar (10º,20º...90º).
%En el vector "media" se encuentran las medias de cada inclinación recogida en Gdm_representar.

Gdm_representar = zeros(12,9);
media = zeros(1,9);

q=0;
    for i=10:10:90
   
        q = q+1;
    
        for j=1:12
        
            Gdm_representar(j,q)= roundn(GdBetaTotal(j,i),-2);
        
        end
    end

%-------------------    
sum = 0;

    for u=1:9
        for v=1:12
        
            sum = sum + (Gdm_representar(v,u)/12);
        
        end
        
        media(u) = roundn(sum,-2);
        sum=0;
    end
    
%----------
%Se calcula ahora la inclinación óptima de los módulos.

%En primer lugar se realiza la media de radiación para todas las
%inclinaciones, y se busca el mayor valor.

%"suma_optimo": la radiación media de cada inclinación (1º...90º)
suma_optimo = zeros(1,91);
suma = 0;

    for m=1:91
        for n=1:12
        
            suma = suma + GdBetaTotal(n,m);
        end
    
        suma_optimo(m)= suma/12;
    
        suma=0;    
    end
%"max": el valor máximo entre todas las inclinaciones.    
    max = 0; 
    for s=1:91
       if suma_optimo(s)> max
           
           max = suma_optimo(s);
           
       end
    end
%En "ángulo_optimo" se encuentra el ángulo óptimo de inclinación para esta ciudad.   
    for t=1:91
    
        if suma_optimo(t)== max
            angulo = t;
        end
    end
    
    angulo_optimo = angulo;
    
    
    
%En "Radiación_optima" se representan las radiaciones mensuales para la inclinación óptima calculada
Radiacion_optima = zeros(1,12);

    for a=1:12
        Radiacion_optima(a) = GdBetaTotal(a,angulo);
        
    end
    
    suma_angulo_optimo = suma_optimo(angulo);
  
        datos = zeros(1,12);    
        for i=1:12
    
            datos(i)=DATOS(i+2);

        end
        med = 0;
        for i=1:12
    
            med = med + datos(i);
   
        end

    media0 = med/12;

if suma_angulo_optimo < media0
    
    angulo_optimo = 0;
    
    for i=1:12
    Radiacion_optima(i) = datos(i);
    end
    
    suma_angulo_optimo = media0;
    
    
end
    
    
    
end
