function [numeroN, matriz_angulos] = Angulos (AngSal1) 

%A partir del ángulo de salida (AngSal1) se obtiene:
    %Ángulo para cada hora de Sol del día intermedio de cada mes(Los
        %ángulos se almacenarán en matriz_angulos)
    %númeroN: el número de horas de Sol de cada día.
    
    %matriz_angulos = zeros(12,12);
    numeroN = zeros(1,12);
    
    for i=1:12
        
        cont = AngSal1(i);
        
        s=-((15/2)*2*pi/360); %15º en radianes. 1 hora = 15º
        n=0;
        r=s;
        
        while cont > (15*2*pi/360)
            
            cont = cont - (15*2*pi/360);
            
            n=n+1;
        
        end
        
        
    %Los valores de W se almacenan en la matriz "matriz_angulos". Ya que las horas del día serán simétricos respecto las 12h 
    %solo para la mitad de los valores.
        
    num = n; %En OrientSol está restado con 1. Para luego ahorrarsélo.
    
        for j=1:n 
        
            r = r + (15*2*pi/360);
    
            matriz_angulos(i, j) = r;
    
        end
        
        numeroN(i) = num;
    end
    